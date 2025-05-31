import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);

  const handleSubmit = async () => {
    if (!file || !agree) return alert('파일과 약관 동의는 필수입니다');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('description', description);

    const res = await axios.post('/api/submit', formData);
    const { documentID } = res.data;
    window.location.href = `/result/${documentID}`;
  };

  return (
    <div>
      <h1>문서 업로드</h1>
      <input placeholder="이름" onChange={e => setName(e.target.value)} />
      <input placeholder="이메일" onChange={e => setEmail(e.target.value)} />
      <textarea placeholder="설명" onChange={e => setDescription(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <label>
        <input type="checkbox" onChange={e => setAgree(e.target.checked)} /> 약관 동의
      </label>
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
}