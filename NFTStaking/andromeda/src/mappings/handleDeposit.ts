import { json, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { Deposit, User, Token, UserToken } from "../../generated/schema";
import { Deposit as DepositEvent } from "../../generated/Contract/CERUSNFTStaking";

// HANDLE DEPOSIT
export function handleDeposit(event: DepositEvent): void {
  // add to deposits
  let id = event.transaction.hash.concatI32(event.logIndex.toI32());
  let deposit = new Deposit(id);

  //   deposit.collection = event.params.collection;
  deposit.tokenId = event.params.tokenId;
  deposit.user = event.params.user;
  deposit.blockTimestamp = event.block.timestamp;
  deposit.blockNumber = event.block.number;
  deposit.transactionHash = event.transaction.hash;

  deposit.save();

  // token
  let tokenEntityId = event.params.tokenId.toString();
  let token = Token.load(tokenEntityId);

  // create token if it does not exist
  if (!token) {
    token = new Token(tokenEntityId);
    token.totalRewardPrimary = BigInt.fromI32(0);
    token.totalRewardSecondary = BigInt.fromI32(0);
    token.lastRewardPrimary = BigInt.fromI32(0);
    token.lastRewardSecondary = BigInt.fromI32(0);
    token.timesRewarded = 0;
    token.timesDeposited = 0;
    token.timesWithdrawn = 0;
  }
  token.timesDeposited += 1;
  token.save();

  // user token
  let userToken = UserToken.load(tokenEntityId);
  if (!userToken) {
    userToken = new UserToken(tokenEntityId);
    userToken.user = event.params.user;
    userToken.token = tokenEntityId;
    userToken.timesRewardedUser = 0;
    userToken.timesDepositedUser = 0;
    userToken.timesWithdrawnUser = 0;
    userToken.totalPrimaryRewardUser = BigInt.fromI32(0);
    userToken.totalSecondaryRewardUser = BigInt.fromI32(0);
    userToken.lastRewardPrimaryUser = BigInt.fromI32(0);
    userToken.lastRewardSecondaryUser = BigInt.fromI32(0);
  }
  userToken.timesDepositedUser += 1;
  userToken.save();

  // Update user's token balance
  let userId = event.params.user.toHex();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.address = event.params.user;
    user.tokenBalance = BigInt.fromI32(0);
    user.userTokens = [];
    user.deposits = BigInt.fromI32(0);
    user.withdraws = BigInt.fromI32(0);
    user.rewards = BigInt.fromI32(0);
    user.totalRewardPrimary = BigInt.fromI32(0);
    user.totalRewardSecondary = BigInt.fromI32(0);
    user.lastRewardPrimary = BigInt.fromI32(0);
    user.lastRewardSecondary = BigInt.fromI32(0);
  }

  // Update tokenIds in UserCollection
  let updatedTokenIds: string[] = user.userTokens;
  updatedTokenIds.push(tokenEntityId);
  user.userTokens = updatedTokenIds;

  // update user balance
  user.deposits = user.deposits.plus(BigInt.fromI32(1));
  user.tokenBalance = user.tokenBalance.plus(BigInt.fromI32(1));
  user.save();
}
