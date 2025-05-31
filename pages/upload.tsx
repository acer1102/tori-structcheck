// pages/upload.tsx
import React, { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !agree) {
      setStatus('파일 업로드와 약관 동의가 필요합니다.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    formData.append('description', description);

    try {
      const res = await axios.post('/api/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus(`✅ 분석 완료: 문서 ID - ${res.data.documentID}`);
    } catch (err: any) {
      setStatus(`❌ 오류 발생: ${err.response?.data?.error || '서버 오류'}`);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 구조 분석 업로드</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <textarea placeholder="설명" value={description} onChange={e => setDescription(e.target.value)} /><br />
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} /><br />
        <label>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} /> 약관에 동의합니다
        </label><br />
        <button type="submit">제출</button>
      </form>
      <p>{status}</p>
    </div>
  );
}
