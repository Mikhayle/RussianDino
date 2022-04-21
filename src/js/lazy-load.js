document.addEventListener("DOMContentLoaded", () =>{
  const lazyLoadVideos = [].slice.call(document.querySelectorAll("video.lazy-video"));
   if ("IntersectionObserver" in window) {
    const lazyVideoObserver = new IntersectionObserver((entries, observer)=> {
     entries.forEach((video)=>{
      if (video.isIntersecting) {
       for (const source in video.target.children) {
       const videoSource = video.target.children[source];
        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
         videoSource.src = videoSource.dataset.src;
        }
       }
       video.target.load();
       video.target.classList.remove("lazy-video");
       lazyVideoObserver.unobserve(video.target);
      }
     });
    });
    lazyLoadVideos.forEach((lazyVideo)=> {
     lazyVideoObserver.observe(lazyVideo);
    });
   }
 });