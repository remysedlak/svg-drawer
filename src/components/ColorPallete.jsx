import clicker from '../assets/cursor.svg';
import grabber from '../assets/grab.svg';
import bucket from '../assets/bucket.svg';

const ColorPallete = ({ setCurrentColor, setCursor}) => {
    return (
        <div className="rounded-xl w-32 p-2 grid grid-cols-2 gap-2 items-center">
            {["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white"].map((color) => (
                <button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className="w-8 h-8 border-3 rounded-full p-2"
                    style={{ backgroundColor: color }}
                />
            ))}
            <img src={clicker} alt="Cursor Icon" className="w-8 h-8" onClick={() => setCursor("crosshair")} />
            <img src={grabber} alt="Grab Icon" className="w-8 h-8" onClick={() => setCursor("grab")} />
            <img src={bucket} alt="Bucket Icon" className="w-8 h-8" onClick={() => setCursor("bucket")} />
        </div>
    );
};

export default ColorPallete;