/**
 * @fileoverview 以下のQiita記事のjsをtypescript化
 * @see https://qiita.com/michimichix521/items/1485f05a45a37d7ffe08
 */

import SHA256 from 'crypto-js/sha256'

class Block {
  public hash: string

  constructor(
    private readonly index: number,
    private readonly timestamp: string,
    private readonly data: string | Record<string, unknown>,
    public previousHash = '',
  ) {
    this.hash = this.calculateHash()
  }
  public calculateHash(): string {
    return SHA256(
      this.index + this.previousHash + this.timestamp + JSON.stringify(this.data),
    ).toString()
  }
}

class Blockchain {
  private readonly chain = [new Block(0, '2019/01/01', 'Genesis block', '0')]

  public addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
  }
  private getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }
}

const coin = new Blockchain()
coin.addBlock(new Block(1, '2020/07/11', { amount: 10 }))
coin.addBlock(new Block(2, '2020/07/12', { amount: 100 }))
coin.addBlock(new Block(3, '2020/07/13', { amount: 1000 }))

console.log(JSON.stringify(coin, null, 4))
