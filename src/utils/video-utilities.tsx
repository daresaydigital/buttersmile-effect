function captureScreenshotFromVideo(video: any): string {
    let canvas = document.createElement('canvas');
    canvas.width = (video as HTMLElement).offsetWidth;
    canvas.height = (video as HTMLElement).offsetHeight;

    let ctx = canvas.getContext('2d');


    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg');
}


export default {captureScreenshotFromVideo};







