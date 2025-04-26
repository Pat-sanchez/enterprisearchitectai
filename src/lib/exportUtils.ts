
import { Element } from './diagramUtils';

// Function to export diagram as SVG
export const exportAsSVG = (svgElement: SVGSVGElement | null): void => {
  if (!svgElement) return;
  
  // Clone the SVG element to avoid modifying the original
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Set width and height explicitly if they're percentages
  if (svgElement.width.baseVal.unitType === SVGLength.SVG_LENGTHTYPE_PERCENTAGE) {
    clonedSvg.setAttribute('width', `${svgElement.clientWidth}`);
  }
  if (svgElement.height.baseVal.unitType === SVGLength.SVG_LENGTHTYPE_PERCENTAGE) {
    clonedSvg.setAttribute('height', `${svgElement.clientHeight}`);
  }
  
  // Set viewBox if missing
  if (!clonedSvg.getAttribute('viewBox')) {
    clonedSvg.setAttribute(
      'viewBox', 
      `0 0 ${clonedSvg.width.baseVal.value} ${clonedSvg.height.baseVal.value}`
    );
  }
  
  // Convert SVG to string
  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  
  // Create a blob with the SVG content
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `archi-diagram-${new Date().toISOString().slice(0, 10)}.svg`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Function to export diagram as PNG
export const exportAsPNG = async (svgElement: SVGSVGElement | null): Promise<void> => {
  if (!svgElement) return;
  
  // Clone the SVG to avoid modifying the original
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
  
  // Set width and height explicitly if needed
  clonedSvg.setAttribute('width', `${svgElement.clientWidth}`);
  clonedSvg.setAttribute('height', `${svgElement.clientHeight}`);
  
  // Set background to white for PNG export
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  rect.setAttribute('fill', 'white');
  clonedSvg.insertBefore(rect, clonedSvg.firstChild);
  
  // Convert SVG to string
  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);
  
  // Create an image from the SVG
  const img = new Image();
  
  // Wait for the image to load
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.src = svgUrl;
  });
  
  // Draw the image on a canvas
  const canvas = document.createElement('canvas');
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  
  // Create download link for the PNG
  const pngUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = pngUrl;
  link.download = `archi-diagram-${new Date().toISOString().slice(0, 10)}.png`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(svgUrl);
};

// Function to export diagram as JSON
export const exportAsJSON = (elements: Element[]): void => {
  const jsonString = JSON.stringify(elements, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `archi-diagram-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
