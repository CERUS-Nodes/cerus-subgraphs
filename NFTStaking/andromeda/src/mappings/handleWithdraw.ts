import { json, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { Deposit, Withdraw, Claim, User, Token, UserToken } from "../../generated/schema";

import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Claim as ClaimEvent,
} from "../../generated/Contract/CERUSNFTStaking";

export function handleWithdraw(event: WithdrawEvent): void {
  // add withdraw
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let withdraw = new Withdraw(id);

  withdraw.user = event.params.user;
  withdraw.tokenId = event.params.tokenId;
  withdraw.blockTimestamp = event.block.timestamp;
  withdraw.blockNumber = event.block.number;
  withdraw.transactionHash = event.transaction.hash;
  withdraw.save();

  // token
  let tokenId = event.params.tokenId.toString();
  let token = Token.load(tokenId);

  if (token) {
    token.timesWithdrawn += 1;
    token.save();
  }

  // user token
  let userToken = UserToken.load(tokenId);
  if (userToken) {
    userToken.timesWithdrawnUser += 1;
    userToken.save();
  }

  // Update user's token balance and withdraws count
  let userId = event.params.user.toHex();
  let user: User | null = User.load(userId);

  if (user !== null) {
    user.tokenBalance = user.tokenBalance.minus(BigInt.fromI32(1));

    // Update user's withdraws count
    user.withdraws = user.withdraws.plus(BigInt.fromI32(1));
    
    // user tokens array
    // Update user collection tokenIds
    let tokenIds = user.userTokens;

    let index = tokenIds.indexOf(tokenId);
    if (index > -1) {
      tokenIds.splice(index, 1);
    }
    user.userTokens = tokenIds;
    user.save();
  }
}
