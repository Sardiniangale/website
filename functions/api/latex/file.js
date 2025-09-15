import { spawn } from 'child_process';
import { Buffer } from 'buffer';

export async function onRequest(context) {
  const repo = 'giacomo/website'; // Assuming this is the repo
  const latexPath = 'Latex/';
  const cwd = '/home/giacomo/Documents/git/website';

  if (context.request.method === 'GET') {
    const url = new URL(context.request.url);
    const fileName = url.searchParams.get('name');
    if (!fileName) {
      return new Response('File name is required', { status: 400 });
    }

    const filePath = `${latexPath}${fileName}`;
    const child = spawn('gh', ['api', `repos/${repo}/contents/${filePath}`], { cwd });

    let output = '';
    child.stdout.on('data', (data) => {
      output += data;
    });

    return new Promise((resolve) => {
      child.on('close', (code) => {
        if (code !== 0) {
          resolve(new Response(`Error reading file: ${output}`, { status: 500 }));
          return;
        }
        try {
          const data = JSON.parse(output);
          const content = Buffer.from(data.content, 'base64').toString('utf-8');
          resolve(new Response(content));
        } catch (e) {
          resolve(new Response(`Error parsing GitHub API response: ${e.message}`, { status: 500 }));
        }
      });
    });
  }

  if (context.request.method === 'POST') {
    const { name, content } = await context.request.json();
    if (!name || content === undefined) {
      return new Response('File name and content are required', { status: 400 });
    }

    const branchName = `update-${name.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    const filePath = `${latexPath}${name}`;
    const commitMessage = `Update ${name}`;

    const runCommands = async () => {
      try {
        // Get main branch SHA
        const mainBranchSha = await new Promise((resolve, reject) => {
          const child = spawn('gh', ['api', `repos/${repo}/git/refs/heads/main`], { cwd });
          let output = '';
          child.stdout.on('data', (data) => { output += data; });
          child.on('close', (code) => {
            if (code !== 0) return reject(output);
            const sha = JSON.parse(output).object.sha;
            resolve(sha);
          });
        });

        // Create branch
        await new Promise((resolve, reject) => {
          const child = spawn('gh', ['api', `repos/${repo}/git/refs`, '-f', `ref=refs/heads/${branchName}`, '-f', `sha=${mainBranchSha}`], { cwd });
          child.on('close', (code) => code === 0 ? resolve() : reject());
        });

        // Get file SHA
        const fileSha = await new Promise((resolve, reject) => {
          const child = spawn('gh', ['api', `repos/${repo}/contents/${filePath}`], { cwd });
          let output = '';
          child.stdout.on('data', (data) => { output += data; });
          child.on('close', (code) => {
            if (code !== 0) return reject('File not found');
            try {
              const sha = JSON.parse(output).sha;
              resolve(sha);
            } catch (e) {
              reject('Error parsing file data');
            }
          });
        });

        // Update file
        await new Promise((resolve, reject) => {
          const child = spawn('gh', ['api', `repos/${repo}/contents/${filePath}`, '-X', 'PUT', '-f', `message=${commitMessage}`, '-f', `content=${Buffer.from(content).toString('base64')}`, '-f', `branch=${branchName}`, '-f', `sha=${fileSha}`], { cwd });
          child.on('close', (code) => code === 0 ? resolve() : reject());
        });

        // Create PR
        await new Promise((resolve, reject) => {
          const child = spawn('gh', ['pr', 'create', '--repo', repo, '--title', commitMessage, '--body', `Pull request for ${name}`, '--base', 'main', '--head', branchName], { cwd });
          child.on('close', (code) => code === 0 ? resolve() : reject());
        });

        return new Response('Pull request created successfully!');
      } catch (error) {
        return new Response(`Error creating pull request: ${error}`, { status: 500 });
      }
    };

    return runCommands();
  }

  return new Response('Method not allowed', { status: 405 });
}