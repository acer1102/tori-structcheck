export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file || !Array.isArray(files.file)) {
      res.status(400).json({ error: 'File upload failed' });
      return;
    }

    const file = files.file[0];
    const text = fs.readFileSync(file.filepath, 'utf-8');

    const prompt = `You are a structure analysis AI.\n[Document Content Start]\n${text}\n[Document Content End]`;

    try {
      const gptRes = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      });

      const content = gptRes.choices[0].message.content;
      if (!content) {
        res.status(500).json({ error: 'Empty response from GPT' });
        return;
      }

      const output = JSON.parse(content);
      const id = uuidv4();

      const dir = path.resolve('./data');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

      fs.writeFileSync(path.join(dir, `${id}.json`), JSON.stringify(output, null, 2));
      res.status(200).json({ documentID: id });
    } catch (error) {
      res.status(500).json({ error: 'Processing failed', detail: (error as Error).message });
    }
  });
}
