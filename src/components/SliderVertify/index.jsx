import React, { useRef, useState, useEffect, ReactNode, memo } from "react";
import "./index.less";
const width = 320,
  height = 160;
const PI = Math.PI,
  l = 42, //滑块边长
  r = 9; //滑块半径
const L = l + r * 2 + 3; // 滑块实际边长
function SliderVertify() {
  const [sliderOffset, setSliderOffset] = useState(0);
  const canvasRef = useRef();
  const blockRef = useRef();
  const imgRef = useRef();
  function drawCanvas() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src =
      "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e2804b48f99443d99806b7d02dd94da~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?";
    img.onload = () => {
      const canvasCtx = canvasRef.current.getContext("2d");
      drawPath(canvasCtx, 50, 50, "fill"); //镂空形状
      canvasCtx.drawImage(img, 0, 0, width, height); //插入背景图

      const blockCtx = blockRef.current.getContext("2d");
      drawPath(blockCtx, 50, 50, "clip"); //使用clip裁剪图案
      blockCtx.drawImage(img, 0, 0, width, height);
      // // 提取滑块并放到最左边
      const y1 = 50 - r * 2 - 1;
      const ImageData = blockCtx.getImageData(50 - 3, y1, L, L);
      blockRef.current.width = L;
      blockCtx.putImageData(ImageData, 0, y1);
    };
  }
  useEffect(() => {
    drawCanvas();
  }, []);
  return (
    <div
      className="vertify-wrapper"
      style={{
        width: width + "px",
        // margin: "0 auto",
        // display: visible ? "" : "none",
      }}
    >
      <div className="canvas-container">
        <canvas ref={canvasRef} width={width} height={height}></canvas>
        <canvas
          ref={blockRef}
          className="block"
          width={width}
          height={height}
        ></canvas>
      </div>
      <div
        className="slider-container"
        style={{
          // pointerEvents: isLoading ? "none" : "auto",
          width: width + "px",
        }}
      >
        <div className="mask" style={{ width: sliderOffset + "px" }}>
          <div className="slider" style={{ width: sliderOffset + "px" }}>
            <div className="icon-arr">&rarr;</div>
          </div>
        </div>
      </div>
      <div className="loading-container">
        <span>加载中</span>
      </div>
    </div>
  );
}

export default React.memo(SliderVertify);

function drawPath(ctx, x, y, operation) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.stroke();
  ctx.globalCompositeOperation = "destination-over";
  operation === "fill" ? ctx.fill() : ctx.clip();
}
