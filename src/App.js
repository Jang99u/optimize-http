import React, { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("");
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseBody, setResponseBody] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!url.trim()) {
      alert("URL을 입력해주세요!");
      return;
    }

    setLoading(true);
    setResponseStatus(null);
    setResponseBody(null);

    try {
      const options = { method };

      // requestBody가 비어있지 않은 경우에만 body와 Content-Type 설정
      if (requestBody.trim()) {
        options.headers = { "Content-Type": "application/json" };
        options.body = requestBody;
      }

      const res = await fetch(url, options);

      // 여기는 fetch 자체가 성공적으로 응답을 받았을 때
      setResponseStatus(res.status); // HTTP Status 그대로 저장

      // 응답 바디를 우선 text로 전체 받아옴
      const text = await res.text();

      if (text) {
        // 내용이 있으면 JSON 파싱 시도 -> 실패하면 그냥 text로 보여줌
        try {
          const jsonData = JSON.parse(text);
          setResponseBody(jsonData);
        } catch {
          setResponseBody(text);
        }
      } else {
        // text가 빈 문자열이면 null (또는 "No Content")로 처리
        setResponseBody(null);
      }
    } catch (error) {
      // fetch 자체에서 네트워크 에러, CORS 에러 등으로 응답을 못받은 경우
      setResponseStatus("네트워크 에러 (fetch 요청중 에러 발생 등)");
      setResponseBody(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">포스트맨 짭퉁 ㅋ</h1>

      <div className="flex-row">
        {/* URL 입력 */}
        <div style={{ flex: 1 }}>
          <div className="form-group">
            <label className="label">Request URL</label>
            <input
              type="text"
              className="input"
              placeholder="https://api.example.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Method 선택 */}
        <div style={{ width: "120px" }}>
          <div className="form-group">
            <label className="label">Method</label>
            <select
              className="select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
        </div>

        {/* Request 전송 버튼 */}
        <div>
          <button className="button" onClick={handleSendRequest} disabled={loading}>
            {loading ? "Sending..." : "Request"}
          </button>
        </div>
      </div>

      {/* Request Body */}
      <div className="form-group">
        <label className="label">Request Body (JSON)</label>
        <textarea
          className="textarea"
          rows={6}
          placeholder='{"title": "새로운 글"}'
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
        />
      </div>

      {/* Response */}
      <div className="response-section">
        <div className="response-status">
          Status Code: {responseStatus !== null ? responseStatus : "-"}
        </div>
        <div className="response-body">
          {responseBody === null
            ? "No Content" // Body가 없으면 No Content 표시 (원하면 공백으로 둬도 됨)
            : typeof responseBody === "object"
              ? <pre>{JSON.stringify(responseBody, null, 2)}</pre>
              : <pre>{responseBody}</pre>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
