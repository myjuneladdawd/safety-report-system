import React, { useState, useEffect } from 'react';
import { getCustomSchoolLogo, LOGO_CHANGE_EVENT } from '../services/logoStorage';

interface SchoolEmblemProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  src?: string;
}

export const SchoolEmblem: React.FC<SchoolEmblemProps> = ({
  className = 'w-12 h-12',
  size,
  showText = true,
  src,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => src || getCustomSchoolLogo());

  useEffect(() => {
    if (src) {
      setCustomLogo(src);
      return;
    }

    const updateLogo = () => {
      setCustomLogo(getCustomSchoolLogo());
    };

    window.addEventListener(LOGO_CHANGE_EVENT, updateLogo);
    return () => {
      window.removeEventListener(LOGO_CHANGE_EVENT, updateLogo);
    };
  }, [src]);

  if (customLogo) {
    return (
      <img
        src={customLogo}
        alt="ตราสัญลักษณ์โรงเรียนบ้านบวกหมื้อ"
        className={`inline-block select-none shrink-0 object-contain drop-shadow-xs ${className}`}
        style={size ? { width: size, height: typeof size === 'number' ? size * 1.45 : size } : undefined}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 400 580"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none shrink-0 ${className}`}
      style={size ? { width: size, height: typeof size === 'number' ? size * 1.45 : size } : undefined}
      aria-label="ตราสัญลักษณ์โรงเรียนบ้านบวกหมื้อ"
    >
      <defs>
        {/* Glow & Shadow Filters */}
        <filter id="emblem-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.3" />
        </filter>
        <filter id="flame-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gold Gradients */}
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="30%" stopColor="#F5B82E" />
          <stop offset="70%" stopColor="#D98A1B" />
          <stop offset="100%" stopColor="#9E5B0E" />
        </linearGradient>

        <linearGradient id="gold-bright" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="40%" stopColor="#FFDE59" />
          <stop offset="80%" stopColor="#E5A118" />
          <stop offset="100%" stopColor="#B3740A" />
        </linearGradient>

        <linearGradient id="gold-bevel" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFD13B" />
          <stop offset="100%" stopColor="#874704" />
        </linearGradient>

        {/* Red Rays Gradient */}
        <linearGradient id="red-ray" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF2E38" />
          <stop offset="50%" stopColor="#D90416" />
          <stop offset="100%" stopColor="#8A000A" />
        </linearGradient>

        {/* Flame Gradient */}
        <radialGradient id="flame-grad" cx="50%" cy="65%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFF275" />
          <stop offset="55%" stopColor="#FF9900" />
          <stop offset="90%" stopColor="#E62E00" />
          <stop offset="100%" stopColor="#800000" stopOpacity="0.2" />
        </radialGradient>

        {/* Dark Metallic Gradient for 'ม' */}
        <linearGradient id="dark-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#474747" />
          <stop offset="30%" stopColor="#222222" />
          <stop offset="70%" stopColor="#111111" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>

        {/* Royal Blue Ribbon Gradient */}
        <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E50A8" />
          <stop offset="40%" stopColor="#0D3A8A" />
          <stop offset="80%" stopColor="#082A6B" />
          <stop offset="100%" stopColor="#041B4A" />
        </linearGradient>
        <linearGradient id="ribbon-fold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#072052" />
          <stop offset="100%" stopColor="#03102C" />
        </linearGradient>

        {/* Book Gradient */}
        <linearGradient id="book-pages" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFEE8" />
          <stop offset="60%" stopColor="#EBD99A" />
          <stop offset="100%" stopColor="#B3934A" />
        </linearGradient>
      </defs>

      {/* Group with filter */}
      <g filter="url(#emblem-shadow)">
        {/* ================= 1. RADIATING RED SUNBURST RAYS ================= */}
        <g transform="translate(200, 190)">
          {/* 17 Sun Rays radiating behind */}
          {[
            -85, -74, -63, -52, -41, -30, -19, -8, 0, 8, 19, 30, 41, 52, 63, 74, 85
          ].map((angle, idx) => {
            const isMajor = idx % 2 === 0;
            const length = isMajor ? 140 : 120;
            const width = isMajor ? 14 : 11;
            return (
              <g key={idx} transform={`rotate(${angle})`}>
                {/* Ray Golden Rim */}
                <polygon
                  points={`0,-${length + 6} ${width + 3},-${length - 30} ${width},-10 -${width},-10 -${width + 3},-${length - 30}`}
                  fill="#F5B82E"
                  stroke="#7A4203"
                  strokeWidth="0.8"
                />
                {/* Ray Red Core */}
                <polygon
                  points={`0,-${length + 3} ${width},-${length - 28} ${width - 3},-12 -${width - 3},-12 -${width},-${length - 28}`}
                  fill="url(#red-ray)"
                  stroke="#FFE082"
                  strokeWidth="0.5"
                />
                {/* Ray Bevel Center Line */}
                <line
                  x1="0"
                  y1="-10"
                  x2="0"
                  y2={`-${length + 2}`}
                  stroke="#FFF2A3"
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
              </g>
            );
          })}
        </g>

        {/* ================= 2. GOLDEN SUN SPHERE / DISC ================= */}
        <circle
          cx="200"
          cy="190"
          r="72"
          fill="url(#gold-bright)"
          stroke="#9E5B0E"
          strokeWidth="3.5"
        />
        <circle
          cx="200"
          cy="190"
          r="66"
          fill="url(#gold-grad)"
          stroke="#FFF9D2"
          strokeWidth="1.5"
        />
        {/* Sun inner ring highlight */}
        <circle
          cx="200"
          cy="188"
          r="58"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />

        {/* ================= 3. BURNING CANDLE ================= */}
        {/* Candle Flame Halo Glow */}
        <ellipse
          cx="200"
          cy="148"
          rx="22"
          ry="34"
          fill="url(#flame-grad)"
          opacity="0.4"
          filter="url(#flame-glow)"
        />

        {/* Candle Flame Outer */}
        <path
          d="M 200 115 C 208 135, 218 148, 216 160 C 214 172, 207 176, 200 176 C 193 176, 186 172, 184 160 C 182 148, 192 135, 200 115 Z"
          fill="url(#flame-grad)"
          filter="url(#soft-glow)"
        />
        {/* Candle Flame Inner Bright Core */}
        <path
          d="M 200 130 C 204 142, 209 152, 208 162 C 207 169, 203 172, 200 172 C 197 172, 193 169, 192 162 C 191 152, 196 142, 200 130 Z"
          fill="#FFFEE0"
        />
        {/* Candle Wick */}
        <line x1="200" y1="172" x2="200" y2="182" stroke="#4A2500" strokeWidth="2.5" strokeLinecap="round" />

        {/* Candle Cylinder (Gold) */}
        <rect
          x="188"
          y="180"
          width="24"
          height="54"
          rx="3"
          fill="url(#gold-grad)"
          stroke="#7A4203"
          strokeWidth="1.5"
        />
        {/* Candle Highlight */}
        <line x1="192" y1="181" x2="192" y2="233" stroke="#FFF7C2" strokeWidth="2" strokeOpacity="0.8" />
        {/* Candle Wax Rim */}
        <ellipse cx="200" cy="180" rx="12" ry="3.5" fill="#FFEFA6" stroke="#9E5B0E" strokeWidth="1" />

        {/* Candle Dish / Holder Base */}
        <path
          d="M 180 232 C 180 230, 190 228, 200 228 C 210 228, 220 230, 220 232 L 214 242 L 186 242 Z"
          fill="url(#gold-bright)"
          stroke="#8A4A02"
          strokeWidth="1.5"
        />
        <ellipse cx="200" cy="242" rx="18" ry="4" fill="url(#gold-grad)" stroke="#693400" strokeWidth="1" />

        {/* ================= 4. THAI INITIALS 'บ' AND 'ม' ================= */}
        {/* 'บ' (Gold, left side) */}
        <g id="letter-bor" transform="translate(132, 215)">
          {/* Beveled Background shadow for บ */}
          <path
            d="M 12 68 C 12 40, 22 18, 42 12 C 58 7, 72 16, 75 32 C 73 34, 66 34, 62 25 C 53 18, 38 21, 34 38 L 34 82 L 72 82 L 72 25 L 88 25 L 88 98 L 18 98 C 14 98, 12 92, 12 85 Z"
            fill="#5C3400"
          />
          {/* Main Gold Body of บ */}
          <path
            d="M 10 65 C 10 38, 20 16, 40 10 C 56 5, 70 14, 73 30 C 69 32, 63 31, 59 23 C 50 16, 36 19, 32 36 L 32 80 L 70 80 L 70 23 L 86 23 L 86 95 L 16 95 C 12 95, 10 89, 10 82 Z"
            fill="url(#gold-bright)"
            stroke="#9E5B0E"
            strokeWidth="2"
          />
          {/* 3D Highlight on บ */}
          <path
            d="M 14 65 C 14 42, 23 21, 40 14 C 47 11, 56 12, 63 18"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
          <line x1="32" y1="36" x2="32" y2="80" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" />
          <line x1="32" y1="92" x2="84" y2="92" stroke="#FFF7B8" strokeWidth="2" />
        </g>

        {/* 'ม' (Dark/Black with Gold Edge, right side) */}
        <g id="letter-mor" transform="translate(195, 215)">
          {/* Beveled shadow for ม */}
          <path
            d="M 10 25 L 26 25 L 26 62 C 30 55, 38 52, 48 56 C 58 61, 62 70, 58 80 C 54 88, 44 92, 34 88 L 34 98 L 74 98 L 74 25 L 90 25 L 90 98 L 10 98 Z"
            fill="#050505"
          />
          {/* Main Dark Body of ม */}
          <path
            d="M 8 23 L 24 23 L 24 60 C 28 53, 36 50, 46 54 C 56 59, 60 68, 56 78 C 52 86, 42 90, 32 86 L 32 95 L 72 95 L 72 23 L 88 23 L 88 95 L 8 95 Z"
            fill="url(#dark-metal)"
            stroke="url(#gold-bright)"
            strokeWidth="2.5"
          />
          {/* Metallic Highlights on ม */}
          <line x1="12" y1="26" x2="12" y2="92" stroke="#A3A3A3" strokeWidth="1.5" />
          <line x1="76" y1="26" x2="76" y2="92" stroke="#A3A3A3" strokeWidth="1.5" />
          <line x1="10" y1="25" x2="86" y2="25" stroke="#FFF5B8" strokeWidth="1.5" />
          <circle cx="44" cy="70" r="7" fill="none" stroke="#F5B82E" strokeWidth="2" />
        </g>

        {/* ================= 5. OPEN GOLDEN BOOK OF WISDOM ================= */}
        <g id="open-book" transform="translate(50, 280)">
          {/* Book Spine Shadow */}
          <path
            d="M 150 78 C 90 62, 30 75, 10 88 L 10 102 C 30 89, 90 76, 150 92 C 210 76, 270 89, 290 102 L 290 88 C 270 75, 210 62, 150 78 Z"
            fill="#5E3A04"
          />
          {/* Book Golden Bottom Cover */}
          <path
            d="M 150 74 C 90 58, 25 72, 5 85 L 5 95 C 25 82, 90 68, 150 84 C 210 68, 275 82, 295 95 L 295 85 C 275 72, 210 58, 150 74 Z"
            fill="url(#gold-grad)"
            stroke="#6E3D00"
            strokeWidth="1.5"
          />
          {/* Book Pages Layer 1 */}
          <path
            d="M 150 68 C 95 53, 35 65, 15 77 L 15 85 C 35 73, 95 61, 150 76 C 205 61, 265 73, 285 85 L 285 77 C 265 65, 205 53, 150 68 Z"
            fill="url(#book-pages)"
            stroke="#D1B266"
            strokeWidth="0.8"
          />
          {/* Top Main Open Pages */}
          <path
            d="M 150 62 C 95 47, 30 58, 15 68 L 15 76 C 30 66, 95 55, 150 70 C 205 55, 270 66, 285 76 L 285 68 C 270 58, 205 47, 150 62 Z"
            fill="#FFFDEB"
            stroke="#8A5A09"
            strokeWidth="1.5"
          />
          {/* Book Central Spine Binding crease */}
          <line x1="150" y1="62" x2="150" y2="88" stroke="#704400" strokeWidth="3" />
          <line x1="149" y1="62" x2="149" y2="88" stroke="#FFE994" strokeWidth="1" />

          {/* Book Page Lines (Left Page) */}
          <path d="M 40 67 C 75 58, 115 56, 140 63" fill="none" stroke="#C2A45D" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 45 73 C 80 64, 115 62, 140 68" fill="none" stroke="#C2A45D" strokeWidth="1.2" strokeOpacity="0.7" />
          
          {/* Book Page Lines (Right Page) */}
          <path d="M 160 63 C 185 56, 225 58, 260 67" fill="none" stroke="#C2A45D" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 160 68 C 185 62, 220 64, 255 73" fill="none" stroke="#C2A45D" strokeWidth="1.2" strokeOpacity="0.7" />
        </g>

        {/* ================= 6. ROYAL BLUE BANNER / RIBBON ================= */}
        {/* Left ribbon tail folds */}
        <path
          d="M 52 385 L 18 368 L 48 340 L 80 348 L 74 380 Z"
          fill="url(#ribbon-fold)"
          stroke="#0F3375"
          strokeWidth="1.2"
        />
        <polygon points="18,368 40,355 48,340" fill="#051838" />
        {/* Left gold ribbon border */}
        <line x1="18" y1="368" x2="48" y2="340" stroke="#F5B82E" strokeWidth="2.5" />
        <line x1="52" y1="385" x2="74" y2="380" stroke="#F5B82E" strokeWidth="2.5" />

        {/* Right ribbon tail folds */}
        <path
          d="M 348 385 L 382 368 L 352 340 L 320 348 L 326 380 Z"
          fill="url(#ribbon-fold)"
          stroke="#0F3375"
          strokeWidth="1.2"
        />
        <polygon points="382,368 360,355 352,340" fill="#051838" />
        {/* Right gold ribbon border */}
        <line x1="382" y1="368" x2="352" y2="340" stroke="#F5B82E" strokeWidth="2.5" />
        <line x1="348" y1="385" x2="326" y2="380" stroke="#F5B82E" strokeWidth="2.5" />

        {/* Main Curved Center Ribbon */}
        <path
          d="M 45 348 C 120 334, 280 334, 355 348 C 362 385, 345 425, 332 435 C 265 410, 135 410, 68 435 C 55 425, 38 385, 45 348 Z"
          fill="url(#ribbon-grad)"
          stroke="#082A6B"
          strokeWidth="2"
        />

        {/* Top Gold Trim on Ribbon */}
        <path
          d="M 45 348 C 120 334, 280 334, 355 348"
          fill="none"
          stroke="url(#gold-bright)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Bottom Gold Trim on Ribbon */}
        <path
          d="M 68 435 C 135 410, 265 410, 332 435"
          fill="none"
          stroke="url(#gold-bright)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Subtle Highlight on Ribbon */}
        <path
          d="M 52 355 C 125 342, 275 342, 348 355"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />

        {/* ================= 7. GOLDEN EMBOSSED SCHOOL NAME TEXT ================= */}
        {showText && (
          <g id="ribbon-text">
            {/* Curved Path for Text or Centered Text with Golden Styling */}
            <path
              id="ribbon-text-path"
              d="M 60 405 C 130 380, 270 380, 340 405"
              fill="none"
            />
            {/* Text Shadow */}
            <text
              fill="#381D00"
              fontSize="24.5"
              fontWeight="800"
              fontFamily="'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif"
              letterSpacing="0.04em"
            >
              <textPath href="#ribbon-text-path" startOffset="50%" textAnchor="middle">
                โรงเรียนบ้านบวกหมื้อ
              </textPath>
            </text>
            {/* Text Main Golden Emboss */}
            <text
              fill="url(#gold-bright)"
              stroke="#874704"
              strokeWidth="0.8"
              fontSize="24"
              fontWeight="800"
              fontFamily="'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif"
              letterSpacing="0.04em"
              dy="-1"
            >
              <textPath href="#ribbon-text-path" startOffset="50%" textAnchor="middle">
                โรงเรียนบ้านบวกหมื้อ
              </textPath>
            </text>
            {/* Top Gilded Shimmer */}
            <text
              fill="#FFFDF0"
              fontSize="24"
              fontWeight="800"
              fontFamily="'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif"
              letterSpacing="0.04em"
              opacity="0.75"
              dy="-2"
            >
              <textPath href="#ribbon-text-path" startOffset="50%" textAnchor="middle">
                โรงเรียนบ้านบวกหมื้อ
              </textPath>
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};
