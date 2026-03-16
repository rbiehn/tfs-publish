/* TFS PUBLISH | components.js | Version 40 | March 16, 2026 */

var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;

function AutoTextarea(props) {
  var ref = useRef(null);
  var mh = (props.style && props.style.minHeight) || 44;
  var doResize = function() {
    var el = ref.current;
    if (!el) return;
    el.style.height = mh + 'px';
    var sh = el.scrollHeight;
    el.style.height = Math.max(sh, mh) + 'px';
  };
  useEffect(function() { doResize(); }, [props.value]);
  useEffect(function() { doResize(); }, []);
  var s = Object.assign({}, props.style || {}, { overflow: 'hidden', resize: 'none' });
  return <textarea ref={ref} value={props.value} onChange={function(e) { if (props.onChange) props.onChange(e); setTimeout(doResize, 0); }} placeholder={props.placeholder} style={s}/>;
}

function UploadBtn(props) {
  var _u = useState(false), uploading = _u[0], setUploading = _u[1];
  var _p = useState(0), pct = _p[0], setPct = _p[1];
  var doUpload = function(file) {
    if (!file || !_sb) return;
    setUploading(true); setPct(0);
    var ext = file.name.split(".").pop() || "mp4";
    var path = "d" + props.day + "/v" + props.ver + "/" + props.slot + "." + ext;
    _sb.storage.from("media").upload(path, file, { upsert: true }).then(function(res) {
      setUploading(false); setPct(100);
      if (res.error) { console.error("Upload error:", res.error); props.onError && props.onError(res.error.message); return; }
      var url = STORAGE_URL + path + "?t=" + Date.now();
      props.onUploaded(url, file.name, file.size);
    }).catch(function(err) { setUploading(false); console.error("Upload error:", err); });
  };
  var onFile = function(e) { var f = e.target.files && e.target.files[0]; if (f) doUpload(f); };
  var onDrop = function(e) { e.preventDefault(); e.stopPropagation(); var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) doUpload(f); };
  var onDragOver = function(e) { e.preventDefault(); e.stopPropagation(); };
  return (
    <div>
      <div onDrop={onDrop} onDragOver={onDragOver}
        style={{ border: "2px dashed " + (uploading ? "#f97316" : "#d4d4db"), borderRadius: 12, padding: "14px", textAlign: "center", cursor: "pointer", background: uploading ? "#f9731608" : "#fafafa", marginTop: 6, position: "relative" }}
        onClick={function() { document.getElementById("upload_" + props.slot + "_" + props.day + "_" + props.ver).click(); }}>
        <input type="file" accept={props.accept || "video/*,image/*"} onChange={onFile} style={{ display: "none" }} id={"upload_" + props.slot + "_" + props.day + "_" + props.ver} />
        {uploading
          ? <span style={{ fontSize: 12, color: "#f97316", fontWeight: 600 }}>Uploading...</span>
          : <span style={{ fontSize: 12, color: "#999" }}>Tap to upload or drag and drop</span>}
      </div>
      {props.fileName && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, padding: "8px 10px", background: "#f4f4f8", borderRadius: 10 }}>
          <span style={{ fontSize: 12, color: "#444", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{props.fileName}</span>
          <span style={{ fontSize: 11, color: "#999", flexShrink: 0 }}>{fmtSize(props.fileSize || 0)}</span>
          <button onClick={function(e) { e.stopPropagation(); if (props.onDelete) props.onDelete(); }}
            style={{ background: "none", border: "1px solid #ef444440", borderRadius: 6, color: "#ef4444", fontSize: 12, cursor: "pointer", padding: "2px 8px", flexShrink: 0 }}>{"\u2715"}</button>
        </div>
      )}
    </div>
  );
}

function CopyBtn(props) {
  var _s = useState(false), ok = _s[0], setOk = _s[1];
  if (!props.text) return null;
  return (
    <button onClick={function(e) { e.stopPropagation(); navigator.clipboard.writeText(props.text).then(function() { setOk(true); setTimeout(function() { setOk(false); }, 1500); }); }}
      style={{ background: ok ? "#22c55e" : "#f97316", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", transition: "background 0.2s" }}>
      {ok ? "\u2713 Copied" : "Copy"}
    </button>
  );
}

function AlgoW(props) {
  if (!props.flags || !props.flags.length) return null;
  return (
    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "8px 10px", marginTop: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#f97316", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Algospeak Warning</div>
      {props.flags.map(function(f, i) {
        return (
          <div key={i} style={{ fontSize: 12, padding: "2px 0" }}>
            <span style={{ background: "#fecaca", color: "#dc2626", padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{f.word}</span>
            <span style={{ color: "#aaa" }}> {"\u2192"} </span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>{f.safe}</span>
          </div>
        );
      })}
    </div>
  );
}
