export async function onRequest(context) {
  const mockFiles = [
    "Fisica2/Fisica2.tex",
    "Laboratorio2/Laboratorio2.tex",
    "MeccanicaClassica/MeccanicaClassica.tex",
    "MetodiMatematici1/MetodiMatematici1.tex",
    "ChimicaGenerale/ChimicaGenerale.tex",
    "ComplementiAnalisiMatematica/ComplementiAnalisiMatematica.tex"
  ];

  return new Response(JSON.stringify(mockFiles), {
    headers: { 'Content-Type': 'application/json' },
  });
}
