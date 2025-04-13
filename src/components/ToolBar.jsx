const ToolBar = (setCurrentTool) => {
    return (

        <div className="rounded-xl w-32 p-2 mx-2">
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
              <button className="px-2 w-full border rounded bg-blue-400 hover:bg-red-600" 
              onClick={copySVGToClipboard} > Code </button>
            </div>
          </div>
          </div>
          )
}
export default ToolBar;