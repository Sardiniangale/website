import { spawn } from 'child_process';

export async function onRequest(context) {
  const repo = 'giacomo/website'; // Assuming this is the repo
  const latexPath = 'Latex/';

  const child = spawn('gh', ['api', `repos/${repo}/git/trees/main?recursive=1`], {
    cwd: '/home/giacomo/Documents/git/website'
  });

  let output = '';
  child.stdout.on('data', (data) => {
    output += data;
  });

  return new Promise((resolve) => {
    child.on('close', (code) => {
      if (code !== 0) {
        resolve(new Response(`Error listing files: ${output}`, { status: 500 }));
        return;
      }
      try {
        const data = JSON.parse(output);
        const texFiles = data.tree
          .filter(file => file.path.startsWith(latexPath) && file.path.endsWith('.tex'))
          .map(file => file.path.substring(latexPath.length)); // remove "Latex/" prefix
        resolve(new Response(JSON.stringify(texFiles), {
          headers: { 'Content-Type': 'application/json' },
        }));
      } catch (e) {
        resolve(new Response(`Error parsing GitHub API response: ${e.message}`, { status: 500 }));
      }
    });
  });
}