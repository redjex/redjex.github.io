function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 600;
    
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        starsContainer.appendChild(star);
    }
}

createStars();

document.fonts.ready.then(() => {
    console.log('Fonts loaded successfully');
});

let selectedMode = '1x3';
let uploadedImage = null;
let allCanvases = [];

const FINAL_WIDTH = 1080;
const FINAL_HEIGHT = 1920;
const IMAGE_HEIGHT = 1350;
const FRAME_HEIGHT = 285;

document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedMode = btn.dataset.mode;
        document.getElementById('preview').style.display = 'none'; 
        document.body.classList.remove('has-results');
        document.querySelector('.container').classList.remove('expanded');
    });
});

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');

uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        loadImage(e.target.files[0]);
    }
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        loadImage(e.dataTransfer.files[0]);
    }
});

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            processBtn.disabled = false;
            uploadArea.innerHTML = `<div class="upload-text">Изображение загружено: ${file.name}</div>`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

async function downloadAll() {
    const zip = new JSZip();
    const folder = zip.folder(`instagram_${selectedMode}`);
    
    for (let i = 0; i < allCanvases.length; i++) {
        const canvas = allCanvases[i];
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/jpeg', 0.95);
        });
        
        folder.file(`part_${i + 1}.jpg`, blob);
    }
    
    zip.generateAsync({ type: 'blob' }).then(function(content) {
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram_${selectedMode}_all.zip`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

processBtn.addEventListener('click', async () => {
    if (!uploadedImage) return;

    allCanvases = [];

    await document.fonts.ready;

    const [rows, cols] = selectedMode.split('x').map(Number);
    
    document.getElementById('preview').style.display = 'block';
    const previewGrid = document.getElementById('previewGrid');
    previewGrid.innerHTML = '';

    document.body.classList.add('has-results');
    document.querySelector('.container').classList.add('expanded');

    setTimeout(() => {
        document.getElementById('preview').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 300);

    const totalWidth = cols * FINAL_WIDTH;
    const totalImageHeight = rows * IMAGE_HEIGHT;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = totalWidth;
    tempCanvas.height = totalImageHeight;

    tempCtx.drawImage(uploadedImage, 0, 0, totalWidth, totalImageHeight);

    let itemIndex = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const left = col * FINAL_WIDTH;
            const upper = row * IMAGE_HEIGHT;
            const fragmentWidth = FINAL_WIDTH;
            const fragmentHeight = IMAGE_HEIGHT;

            const fragmentCanvas = document.createElement('canvas');
            const fragmentCtx = fragmentCanvas.getContext('2d');
            fragmentCanvas.width = fragmentWidth;
            fragmentCanvas.height = fragmentHeight;
            
            fragmentCtx.drawImage(
                tempCanvas,
                left, upper, fragmentWidth, fragmentHeight,
                0, 0, fragmentWidth, fragmentHeight
            );

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = FINAL_WIDTH;
            canvas.height = FINAL_HEIGHT;


            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, FINAL_WIDTH, FINAL_HEIGHT);

            const paste_x = Math.floor((FINAL_WIDTH - fragmentWidth) / 2);
            const paste_y = FRAME_HEIGHT;
            ctx.drawImage(fragmentCanvas, paste_x, paste_y);

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 48px "Special Gothic Expanded One", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            

            ctx.fillText('@redjex', FINAL_WIDTH / 2, FRAME_HEIGHT / 2);
            ctx.fillText('@redjex', FINAL_WIDTH / 2, FRAME_HEIGHT + IMAGE_HEIGHT + FRAME_HEIGHT / 2);

            allCanvases.push(canvas);

            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.style.animationDelay = `${itemIndex * 0.1}s`;

            const previewCanvas = canvas.cloneNode(true);
            const previewCtx = previewCanvas.getContext('2d');
            previewCtx.drawImage(canvas, 0, 0);
            previewCanvas.className = 'preview-canvas';

            previewItem.appendChild(previewCanvas);
            previewGrid.appendChild(previewItem);
            
            itemIndex++;
        }
    }
});

document.getElementById('downloadAllBtn').addEventListener('click', downloadAll);

function downloadCanvas(canvas, filename) {
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.95);
}