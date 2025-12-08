import React, { useState, useRef, useEffect, useCallback } from 'react';
import './LotteryWheel.css';

const DEFAULT_WHEEL_SIZE = 400;
const SPIN_DURATION = 3000;
const DEFAULT_SEGMENT_COLORS = ['#e6f7ff', '#bae7ff'];
const MIN_PARTICIPANTS = 1;

function LotteryWheel({
  participants = [],
  awards = [],
  selectedAwardId,
  selectedAwardDrawnCount = 0,
  manualDrawnCounts = {},
  wheelSize,
  drawnParticipants = new Set(), 
  onDraw,
  spinCycles = 5,
  textFont = '16px Arial',
  segmentColors = DEFAULT_SEGMENT_COLORS,
  pointerColor = '#ff4d4f',
  buttonText = '开始抽奖',
  spinningText = '抽奖中...',
}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const availableAwards = useCallback(() => {
    if (!selectedAwardId) return [];
    const selectedAward = awards.find(a => a.id === selectedAwardId);
    if (!selectedAward) return [];

    const manualCount = manualDrawnCounts[selectedAward.id];
    const drawnCount = manualCount ?? selectedAwardDrawnCount;

    if (drawnCount >= selectedAward.quantity) return [];

    return [selectedAward];
  }, [
    selectedAwardId,
    awards,
    manualDrawnCounts,
    selectedAwardDrawnCount,
  ]);

  const allParticipants = useCallback(() => {
    return participants.filter(p => p?.id) || [];
  }, [participants]);

  const availableParticipants = useCallback((awardLevel) => {
    return participants.filter(p => {
      if (!p?.id) return false;
      if (drawnParticipants.has(p.id)) return false;
      const level = p.level ?? 0;
      return level >= awardLevel;
    });
  }, [participants, drawnParticipants]);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    if (!container) return;

    const containerSize = wheelSize
      ? Math.min(wheelSize.width, wheelSize.height) - 20
      : DEFAULT_WHEEL_SIZE - 20;
    const canvasSize = Math.min(container.clientWidth, container.clientHeight) || containerSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const validParticipants = allParticipants();
    const segmentCount = Math.max(validParticipants.length, MIN_PARTICIPANTS);

    if (segmentCount === 0) {
      drawEmptyWheel(ctx, centerX, centerY, radius);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / segmentCount;

    validParticipants.forEach((p, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;

      drawSegment(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle,
        segmentColors[index % segmentColors.length]
      );

      drawParticipantText(
        ctx,
        centerX,
        centerY,
        radius,
        startAngle,
        endAngle,
        p.name || `参与者${index + 1}`,
        textFont
      );
    });
  }, [allParticipants, wheelSize, segmentColors, textFont]);

  const drawEmptyWheel = (ctx, centerX, centerY, radius) => {
    ctx.fillStyle = '#f5f5f5';
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#999';
    ctx.font = textFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('暂无参与者', centerX, centerY);
  };

  const drawSegment = (ctx, centerX, centerY, radius, startAngle, endAngle, color) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = '#91d5ff';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawParticipantText = (ctx, centerX, centerY, radius, startAngle, endAngle, text, font) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(startAngle + (endAngle - startAngle) / 2);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#000';
    ctx.font = font;

    const maxWidth = radius * 0.7;
    const measured = ctx.measureText(text);
    let display = text;

    if (measured.width > maxWidth) {
      let t = text;
      while (ctx.measureText(t + '...').width > maxWidth && t.length > 0) {
        t = t.slice(0, -1);
      }
      display = t + '...';
    }

    ctx.fillText(display, radius * 0.6, 0);
    ctx.restore();
  };

  useEffect(() => {
    drawWheel();

    if (typeof ResizeObserver !== 'undefined' && canvasRef.current) {
      const container = canvasRef.current.parentElement;
      if (container) {
        resizeObserverRef.current = new ResizeObserver(() => {
          requestAnimationFrame(() => drawWheel());
        });

        resizeObserverRef.current.observe(container);
      }
    }

    return () => {
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [drawWheel]);

  useEffect(() => {
    drawWheel();
  }, [participants, drawWheel]);

  const handleSpin = () => {
    if (isSpinning) return;

    const validAwards = availableAwards();
    if (!selectedAwardId) {
      alert('请先选择一个奖项！');
      return;
    }

    const award = awards.find(a => a.id === selectedAwardId);
    if (!award) {
      alert('奖项不存在！');
      return;
    }

    const manual = manualDrawnCounts[award.id];
    const drawnCount = manual ?? selectedAwardDrawnCount;
    const remaining = award.quantity - drawnCount;

    const awardLevel = award.level ?? 0;
    const validParticipants = availableParticipants(awardLevel);

    if (validAwards.length === 0) {
      alert(`当前奖项 “${award.name}” 已达到最大数量（${drawnCount}/${award.quantity}）`);
      return;
    }

    if (validParticipants.length === 0) {
      alert(`没有符合条件的参与者可抽奖`);
      return;
    }

    if (typeof onDraw !== 'function') return;

    setIsSpinning(true);

    const selected = selectParticipantByLevel(award, validParticipants);
    if (!selected) {
      alert('抽奖失败，请检查参与者!');
      setIsSpinning(false);
      return;
    }

    const allList = allParticipants();
    const finalRotation = calculateFinalRotation(selected, allList);

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onDraw(selected, award);
    }, SPIN_DURATION);
  };

  const selectParticipantByLevel = (award, list) => {
    if (!list.length) return null;

    const level = award.level ?? 0;

    if (level <= 1) {
      return list[Math.floor(Math.random() * list.length)];
    }

    const totalWeight = list.reduce((sum, p) => sum + (p.weight || 0), 0);
    if (totalWeight <= 0) {
      return list[Math.floor(Math.random() * list.length)];
    }

    let r = Math.random() * totalWeight;
    for (const p of list) {
      r -= p.weight || 0;
      if (r <= 0) return p;
    }
    return list[list.length - 1];
  };

  const calculateFinalRotation = (target, list) => {
    const len = list.length;
    const anglePer = 360 / len;
    const current = rotation % 360;

    const index = list.findIndex(p => p.id === target.id);
    const centerAngle = (-90 + index * anglePer + anglePer / 2 + 360) % 360;

    let targetAngle = 270 - centerAngle - current;
    if (targetAngle < 0) targetAngle += 360;

    return rotation + spinCycles * 360 + targetAngle;
  };

  const getContainerSize = () => {
    if (wheelSize) return Math.min(wheelSize.width, wheelSize.height);
    return DEFAULT_WHEEL_SIZE;
  };

  return (
    <div className="lottery-wheel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        className="wheel-container-wrapper"
        style={{
          width: `${getContainerSize()}px`,
          height: `${getContainerSize()}px`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="wheel-pointer-top"
          style={{
            position: 'absolute',
            top: 0,
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderBottom: `25px solid ${pointerColor}`,
            zIndex: 10,
            transform: 'translateY(-50%)',
          }}
        />

        <div
          className="wheel-wrapper"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)` : 'none',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <canvas
            ref={canvasRef}
            className="wheel-canvas"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      <button
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
        style={{
          marginTop: '20px',
          padding: '12px 36px',
          fontSize: '18px',
          backgroundColor: isSpinning ? '#ccc' : '#1890ff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: isSpinning ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s',
        }}
      >
        {isSpinning ? spinningText : buttonText}
      </button>
    </div>
  );
}

export default LotteryWheel;
