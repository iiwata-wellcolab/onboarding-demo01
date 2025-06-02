import { Transform } from 'stream';

/**
 * UTF-8 BOMを取り除くTransformストリーム
 */
export function stripBomStream() {
  let isFirstChunk = true;
  
  return new Transform({
    transform(chunk, encoding, callback) {
      // 最初のチャンクの場合、BOMを確認して取り除く
      if (isFirstChunk) {
        isFirstChunk = false;
        
        // UTF-8 BOMのチェック (EF BB BF)
        if (chunk.length >= 3 && chunk[0] === 0xEF && chunk[1] === 0xBB && chunk[2] === 0xBF) {
          // BOMを取り除いたチャンクを渡す
          callback(null, chunk.slice(3));
          return;
        }
      }
      
      // BOMがないか、最初のチャンクでない場合はそのまま渡す
      callback(null, chunk);
    }
  });
}
