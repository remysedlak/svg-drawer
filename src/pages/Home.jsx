import React, { useState } from 'react';
import clicker from '../assets/cursor.svg';
import grabber from '../assets/grab.svg';
import bucket from '../assets/bucket.svg';

const Home = () => {
  const [shapes, setShapes] = useState([]);
  const [currentTool, setCurrentTool] = useState("rectangle");
  const [currentColor, setCurrentColor] = useState("white");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [redoStack, setRedoStack] = useState([]);
  const [cursor, setCursor] = useState("crosshair");
  const [draggingShapeIndex, setDraggingShapeIndex] = useState(null);

  const handleMouseDown = (e) => {
    const { x, y } = getMousePosition(e);

    if (cursor === "grab") {
      const shapeIndex = shapes.findIndex((shape) =>
        isPointInsideShape(x, y, shape)
      );
      if (shapeIndex !== -1) {
        setDraggingShapeIndex(shapeIndex);
        setIsDrawing(false);
        return;
      }
    }
    if (draggingShapeIndex !== null) return;
    setIsDrawing(true);
    setCurrentShape({ type: currentTool, x, y, width: 0, height: 0, color: currentColor });
  };

  const handleMouseMove = (e) => {
    const { x, y } = getMousePosition(e);

    if (draggingShapeIndex !== null) {
      const dx = x - shapes[draggingShapeIndex].x;
      const dy = y - shapes[draggingShapeIndex].y;
      const updatedShapes = [...shapes];
      updatedShapes[draggingShapeIndex] = {
        ...updatedShapes[draggingShapeIndex],
        x: x,
        y: y,
      };
      setShapes(updatedShapes);
      return;
    }

    if (!isDrawing) return;
    const dx = x - currentShape.x;
    const dy = y - currentShape.y;
    setCurrentShape({ ...currentShape, width: dx, height: dy });
  };

  const handleMouseUp = () => {
    if (draggingShapeIndex !== null) {
      setDraggingShapeIndex(null);
      return;
    }

    setIsDrawing(false);
    setShapes([...shapes, currentShape]);
    setCurrentShape(null);
  };

  const getMousePosition = (e) => {
    const svg = document.getElementById("canvas");
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: cursorPt.x, y: cursorPt.y };
  };

  const isPointInsideShape = (x, y, shape) => {
    switch (shape.type) {
      case "rectangle":
      case "square":
        return (
          x >= shape.x &&
          x <= shape.x + Math.abs(shape.width) &&
          y >= shape.y &&
          y <= shape.y + Math.abs(shape.height)
        );
      case "circle":
        const radius = Math.sqrt(shape.width ** 2 + shape.height ** 2);
        return Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2) <= radius;
      case "triangle":
        // Simplified bounding box check for triangle
        const minX = Math.min(shape.x, shape.x + shape.width, shape.x + shape.width / 2);
        const maxX = Math.max(shape.x, shape.x + shape.width, shape.x + shape.width / 2);
        const minY = Math.min(shape.y, shape.y - shape.height, shape.y);
        const maxY = Math.max(shape.y, shape.y - shape.height, shape.y);
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
      default:
        return false;
    }
  };

  const renderShape = (shape, i, preview = false) => {
    const stroke = preview ? "gray" : "black";
    const strokeWidth = preview ? "2" : "4";
    const strokeDasharray = preview ? "4" : "0";
    const fill = preview ? "none" : shape.color;

    switch (shape.type) {
      case "rectangle":
        return (
          <rect
            key={i}
            x={Math.min(shape.x, shape.x + shape.width)}
            y={Math.min(shape.y, shape.y + shape.height)}
            width={Math.abs(shape.width)}
            height={Math.abs(shape.height)}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        );
      case "circle":
        const radius = Math.sqrt(shape.width ** 2 + shape.height ** 2);
        return (
          <circle
            key={i}
            cx={shape.x}
            cy={shape.y}
            r={radius}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        );
      case "triangle":
        const p1 = `${shape.x},${shape.y}`;
        const p2 = `${shape.x + shape.width},${shape.y}`;
        const p3 = `${shape.x + shape.width / 2},${shape.y - shape.height}`;
        return (
          <polygon
            key={i}
            points={`${p1} ${p2} ${p3}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        );
      case "square":
        const side = Math.min(Math.abs(shape.width), Math.abs(shape.height));
        return (
          <rect
            key={i}
            x={shape.x}
            y={shape.y}
            width={side}
            height={side}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-roboto p-4">
      <h1 className="text-center text-6xl font-bold">SVG Drawer</h1>
      <h2 className="text-center text-xl font-semibold text-gray-800">Created by Remy Sedlak</h2>

      <div className="mt-8 flex flex-row w-full h-[460px] rounded-lg shadow-lg border-2 border-black bg-gray-100">
        {/* Color Palette */}
        <div className="rounded-xl w-32 p-2 grid grid-cols-2 gap-2 items-center">
            {["red", "blue", "green", "yellow", "purple", "orange", "pink", "black", "white"].map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className="w-8 h-8 border-1 rounded-full p-2"
                style={{ backgroundColor: color }}
              />
            ))}
            <img src={clicker} alt="Cursor Icon" className="w-8 h-8" onClick={() => setCursor("crosshair")} />
            <img src={grabber} alt="Grab Icon" className="w-8 h-8" onClick={() => setCursor("grab")} />
            <img src={bucket} alt="Bucket Icon" className="w-8 h-8" onClick={() => setCursor("bucket")} />
        </div>

        {/* Drawing Canvas */}
        <svg
          id="canvas"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox="0 0 1600 1600"
          className="border-x-2 border-dotted bg-gray-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {shapes.map((shape, i) => renderShape(shape, i))}
          {isDrawing && currentShape && renderShape(currentShape, "preview", true)}
        </svg>

        {/* Tool Selector */}
        <div className="border-2 border-gray-600 rounded-xl w-32 p-2 mx-2">
          <h3 className="text-center font-semibold mb-2">Tools</h3>
          <div className="flex flex-col gap-2">
            {["rectangle", "circle", "triangle", "square"].map((tool) => (
              <button
                key={tool}
                onClick={() => setCurrentTool(tool)}
                className={`p-2 border rounded ${
                  currentTool === tool ? "bg-green-400" : "hover:bg-yellow-400"
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
          {(shapes.length > 0) ?
            <button
              onClick={() => {
                setRedoStack([...redoStack, shapes[shapes.length - 1]]);
                setShapes(shapes.slice(0, -1));
              }}
              className="px-2 w-full border rounded bg-yellow-400 hover:bg-yellow-600"
            >
              Undo
            </button>
            : null}
            {redoStack.length > 0 && shapes != [] ? (
              <button
                onClick={() => {
                  if (redoStack.length > 0 && shapes != []) {
                    setShapes([...shapes, redoStack[redoStack.length - 1]]);
                    setRedoStack(redoStack.slice(0, -1));
                  }
                }}
                className="px-2 w-full border rounded bg-green-400 hover:bg-green-600"
              >
                Redo
              </button>
            ) : null}
            <div className="flex flex-col gap-y-6">
              <button
                onClick={() => {
                  setShapes([])
                  setRedoStack([])
                  setCurrentShape(null)
                }
                }
                className="px-2 w-full border rounded bg-red-400 hover:bg-red-600"
              >
                Clear
              </button>
              <button className="px-2 w-full border rounded bg-blue-400 hover:bg-red-600"
              onClick={() => {{
                const svgData = new XMLSerializer().serializeToString(document.getElementById("canvas"))
                const blob = new Blob([svgData], { type: "image/svg+xml" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "drawing.svg";
                document.body.appendChild(a);
                a.click();  
              }}}>
                Export
              </button>
              <button className="px-2 w-full border rounded bg-blue-400 hover:bg-red-600">
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
