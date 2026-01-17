const { useState, useRef } = React;
const DENSITY = "Ñ@#W$9876543210?!abc;:+=-,._ ";

const App = () => {
    // 1. State Management (React Hook)
    const [ascii, setAscii] = useState("Upload an image to start...");
    const canvasRef = useRef(null);

    // 2. Event Handler
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => convertToAscii(img);
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 3. The Logic
    const convertToAscii = (img) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = 100; 
        const height = Math.floor(width * (img.height / img.width) * 0.55);

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const pixels = ctx.getImageData(0, 0, width, height).data;
        let charString = "";

        for (let i = 0; i < pixels.length; i += 4) {
            const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            const charIndex = Math.floor((avg / 255) * (DENSITY.length - 1));
            charString += DENSITY[charIndex];
            if (((i / 4) + 1) % width === 0) charString += "\n";
        }
        setAscii(charString);
    };

    // 4. The JSX (The UI)
    return (
        <div className="container">
            <h1>RETROIFY REACT</h1>
            
            <label className="btn">
                Upload Image
                <input type="file" accept="image/*" onChange={handleUpload} style={{display:'none'}}/>
            </label>

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className="ascii-box">
                <pre>{ascii}</pre>
            </div>
        </div>
    );
};

// 5. Mount the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
