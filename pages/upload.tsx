import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!file || !agree) {
      alert('파일 업로드와 약관 동의가 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/submit', formData);
      setResponse(`문서 ID: ${res.data.documentID}`);
    } catch (error: any) {
      console.error(error);
      alert('업로드 실패: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>AI 구조 분석 업로드</h2>
      <input
        placeholder="이메일"
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <textarea
        placeholder="설명"
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <input
        type="file"
        onChange={e => {
          const fileList = e.target.files;
          if (fileList && fileList[0]) {
            setFile(fileList[0]);
          }
        }}
      />
      <br />
      <label>
        <input
          type="checkbox"
          onChange={e => setAgree(e.target.checked)}
        />{' '}
        약관에 동의합니다
      </label>
      <br />
      <button onClick={handleSubmit}>제출</button>
      {response && <p>{response}</p>}
    </div>
  );
}
