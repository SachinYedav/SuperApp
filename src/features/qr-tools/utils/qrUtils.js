export const downloadQrCode = (format = 'png', fileName = 'qr-code') => {
  const svg = document.getElementById("qr-code-svg");
  if (!svg) return;

  if (format === "svg") {
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    const padding = 40;
    canvas.width = img.width + padding;
    canvas.height = img.height + padding;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, padding / 2, padding / 2);

    const fileUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}-${Date.now()}.png`;
    link.href = fileUrl;
    link.click();
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
};

export const buildWifiString = ({ ssid, password, encryption, hidden }) => {
  if (!ssid) return '';
  return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden};;`;
};
