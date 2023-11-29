const apiUrl = "http://localhost:5000";

async function getApi(signal) {
  console.log("executou");
  const response = await fetch(apiUrl, {
    signal,
  });
  dreate
  const reader = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(parseNDJson());
  // .pipeTo(
  //   new WritableStream({
  //     write(chunk) {
  //       console.log(chunk);
  //     },
  //   })
  // );
  return reader;
}

function appendToHTML(element) {
  return new WritableStream({
    write({ title, description, url_anime }) {
      const card = `
            <article>
                <div class="text">
                    <h1>${title}</h1>
                    <p>${description}</p>
                    <a href="${url_anime}">here why</a>
                </div>
            </article>
                      `;
      element.innerHTML += card
    },
  });
}

function parseNDJson() {
  let ndJsonBuffer = "";
  return new TransformStream({
    transform(chunk, controler) {
      ndJsonBuffer += chunk;
      const breakLine = ndJsonBuffer.split("\n");
      breakLine.slice(0, -1).forEach((item) => {
        controler.enqueue(JSON.parse(item));
      });
      ndJsonBuffer = breakLine[breakLine.length - 1];
    },
    flush(controler) {
      if (!ndJsonBuffer) {
        return;
      }
      controler.enqueue(JSON.parse(ndJsonBuffer));
    },
  });
}

const [start, stop, cards] = ["start", "stop", "cards"].map((item) =>
  document.getElementById(item)
);
console.log(start);
let abortController = new AbortController();

start.addEventListener('click', async () => {
  const readale = await getApi(abortController.signal);
  readale.pipeTo(appendToHTML(cards));
}),

stop.addEventListener('click', () => {
 abortController.abort()
 abortController = new AbortController();
})
