function toEmbedUrl(href) {
  try {
    const url = new URL(href);
    // Qumu Cloud: keep /view/<id>, just append autoplay=false
    if (/qumucloud\.com$/i.test(url.hostname)) {
      url.searchParams.set('autoplay', 'false');
      return url.toString();
    }
    // YouTube
    if (/^(www\.)?(youtube\.com|youtu\.be)$/i.test(url.hostname)) {
      const id = url.hostname.includes('youtu.be')
        ? url.pathname.slice(1)
        : url.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo
    if (/^(www\.|player\.)?vimeo\.com$/i.test(url.hostname)) {
      const id = url.pathname.split('/').filter(Boolean).pop();
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
  } catch (e) {
    // ignore malformed URLs
  }
  return null;
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-video-${cols.length}-cols`);

  // setup image / video columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-video-img-col');
        }
        return;
      }
      // Convert a bare video link to an iframe embed
      const link = col.querySelector('a[href]');
      if (link && link.href === link.textContent.trim()) {
        const embedUrl = toEmbedUrl(link.href);
        if (embedUrl) {
          const wrap = document.createElement('div');
          wrap.className = 'columns-video-embed';
          const iframe = document.createElement('iframe');
          iframe.src = embedUrl;
          iframe.title = 'Video Content';
          iframe.setAttribute('loading', 'lazy');
          iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
          wrap.append(iframe);
          link.closest('p').replaceWith(wrap);
          col.classList.add('columns-video-video-col');
        }
      }
    });
  });
}
