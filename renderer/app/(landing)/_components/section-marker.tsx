export function SectionMarker() {
  return (
    <div className="section-marker">
      <span id="sectionMarkerNum">01</span>
      <span className="bar" id="sectionMarkerBar" />
      <span id="sectionMarkerLabel">Inicio</span>
    </div>
  );
}

export function ScrollProgress() {
  return <div className="scroll-progress" id="scrollProgress" />;
}
