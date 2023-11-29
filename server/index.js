import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { Readable, Transform } from "node:stream";
import { WritableStream, TransformStream, ReadableStream } from "node:stream/web";
import csvtojson from "csvtojson";
import { setTimeout} from 'node:timers/promises'
const PORT = 5000;
new ReadableStream({start(){}})
createServer(async (request, response) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  };
  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }
  let items = 0;
  response.once('close', _ => console.log(`connection was close ${items}`))
  Readable.toWeb(createReadStream("./animeflv.csv"))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
        transform(chunk, controler){
            const data = JSON.parse( Buffer.from(chunk).toString())
            const mappedData = {
                title: data.title,
                description: data.description,
                url_anime: data.url_anime
            }
            controler.enqueue(JSON.stringify(mappedData).concat('\n')
            )
        }    }))
    .pipeTo(
      new WritableStream({
        async write(chunk) {
            await setTimeout(1000)
          items++;
          response.write(chunk);
        },
        close() {
          response.end();
        },
      })
    );
  response.writeHead(200, headers);
  // response.end('ok')
})
  .listen(PORT)
  .on("listening", (_) => console.log(`Server is running at port:${PORT}`));
