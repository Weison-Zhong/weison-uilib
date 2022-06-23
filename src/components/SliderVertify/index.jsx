import React, { useRef, useState, useEffect, memo } from "react";
import "./index.less";
import { createRandomNumFromStartToEnd, isFunction } from "@/utils/tools";
const width = 320,
  height = 160,
  l = 42, //滑块边长
  r = 9, //滑块半径
  PI = Math.PI;
let img = null,
  canvasCtx = null,
  blockCtx = null,
  initBlockX = 0, //随机拼图的x位置
  initBlockY = 0, //随机拼图的y位置
  isMouseDown = false, //鼠标是否点击
  originMouseX = 0; //鼠标第一下点击时的X值;

const L = l + r * 2 + 3; // 滑块实际边长
const paddindOffset = L + 10; //最小也要偏离四边滑块长度+10

function SliderVertify(props) {
  const { afterSuccess, afterFail, imgUrl } = props || {};
  const [sliderOffset, setSliderOffset] = useState(0);
  const canvasRef = useRef();
  const blockRef = useRef();
  const initCanvas = () => {
    img = new Image();
    img.crossOrigin = "Anonymous";
    img.src =
      imgUrl ||
      "https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e2804b48f99443d99806b7d02dd94da~tplv-k3u1fbpfcp-zoom-crop-mark:3024:3024:3024:1702.awebp?";
    img.onload = () => {
      drawCanvas();
    };
  };
  const drawCanvas = () => {
    //随机出现拼图距离左侧的距离
    initBlockX = createRandomNumFromStartToEnd(
      paddindOffset,
      width - paddindOffset
    );
    initBlockY = createRandomNumFromStartToEnd(
      paddindOffset,
      height - paddindOffset
    );
    canvasCtx = canvasRef.current.getContext("2d");
    drawPath(canvasCtx, initBlockX, initBlockY, "fill"); //镂空形状
    canvasCtx.drawImage(img, 0, 0, width, height); //插入背景图
    blockCtx = blockRef.current.getContext("2d");
    drawPath(blockCtx, initBlockX, initBlockY, "clip"); //使用clip裁剪图案
    blockCtx.drawImage(img, 0, 0, width, height);
    // // 提取滑块并放到最左边
    const y1 = initBlockY - r * 2 - 1;
    const ImageData = blockCtx.getImageData(initBlockX - 3, y1, L, L);
    blockRef.current.width = L;
    blockCtx.putImageData(ImageData, 0, y1);
  };
  const reset = () => {
    // 重置样式
    setSliderOffset(0);
    blockRef.current.width = width;
    blockRef.current.style.left = 0 + "px";
    // 清空画布
    canvasCtx.clearRect(0, 0, width, height);
    blockCtx.clearRect(0, 0, width, height);
    drawCanvas();
  };
  const handleDragStart = (e) => {
    originMouseX = e.clientX || e.touches[0].clientX;
    isMouseDown = true;
  };
  const handleDragMove = (e) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const eventX = e.clientX || e.touches[0].clientX; //移动后的鼠标x
    const moveX = eventX - originMouseX; //鼠标移动后的实时X与鼠标第一下按下去的x位置的差值即鼠标拖动的距离
    if (moveX < 0 || moveX + 38 >= width) return;
    setSliderOffset(moveX);
    const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX;
    blockRef.current.style.left = blockLeft + "px"; //同步改变拼图位置
  };
  const handleDragEnd = (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;
    const eventX = e.clientX || e.changedTouches[0].clientX;
    if (eventX === originMouseX) return; //x没变
    //验证是否通过
    const blockOffset = parseInt(blockRef.current.style.left); //移动后的拼图left偏移值
    const isSuccess = Math.abs(blockOffset - initBlockX) < 10;
    if (isSuccess) {
      isFunction(afterSuccess) && afterSuccess();
    } else {
      isFunction(afterFail) && afterFail();
      reset();
    }
  };
  useEffect(() => {
    initCanvas();
    // eslint-disable-next-line
  }, []);
  return (
    <div
      className="vertify-wrapper"
      style={{
        width: width + "px",
        margin: "0 auto",
      }}
      onMouseMove={handleDragMove}
      onTouchMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
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
          width: width + "px",
        }}
      >
        <div className="mask" style={{ width: sliderOffset + "px" }}>
          <div
            className="slider"
            style={{ left: sliderOffset + "px" }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="icon-arr">&rarr;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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

export default memo(SliderVertify);
