import { json, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  // Collection,
  Deposit,
  Withdraw,
  // RewardAdded,
  // UserReward,
  Claim,
  // RetrieveToken,
  User,
  // UserCollection,
  Token,
  UserToken,
} from "../../generated/schema";

import {
  // CollectionAdded as CollectionAddedEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  // RewardAdded as RewardAddedEvent,
  // Reward as RewardEvent,
  Claim as ClaimEvent,
  // RetrieveToken as RetrieveTokenEvent,
} from "../../generated/Contract/CERUSNFTStaking";

// Handlers for Claim event

export function handleClaim(event: ClaimEvent): void {
  // claim
  let claim = new Claim(event.transaction.hash.concatI32(event.logIndex.toI32()));
  claim.user = event.params.user;
  claim.amountPrimary = event.params.amountPrimary;
  claim.amountSecondary = event.params.amountSecondary;
  claim.blockNumber = event.block.number;
  claim.blockTimestamp = event.block.timestamp;
  claim.transactionHash = event.transaction.hash;
  claim.save();

  // user
  let userId = event.params.user.toHex();
  let user = User.load(userId);
  if (user != null) {
    // to satisfy ts. unknown users can't claim.

    // 0 reward does't count.
    if (event.params.amountPrimary != BigInt.fromI32(0)) {
      user.totalRewardPrimary = user.totalRewardPrimary.plus(event.params.amountPrimary);
      user.lastRewardPrimary = event.params.amountPrimary;
    }
    if (event.params.amountSecondary != BigInt.fromI32(0)) {
      user.totalRewardSecondary = user.totalRewardSecondary.plus(event.params.amountSecondary);
      user.lastRewardSecondary = event.params.amountSecondary;
    }

    if (event.params.amountPrimary != BigInt.fromI32(0) || event.params.amountSecondary != BigInt.fromI32(0)) {
      user.rewards = user.rewards.plus(BigInt.fromI32(1));
    }
    user.save();

    // tokens
    let currentTokens = user.userTokens;
    let amountPrimary = event.params.amountPrimary.div(BigInt.fromI32(currentTokens.length));
    let amountSecondary = event.params.amountSecondary.div(BigInt.fromI32(currentTokens.length));

    // update each token

    for (let i = 0; i < currentTokens.length; i++) {
      let tokenId = currentTokens[i];
      let token = Token.load(tokenId);
      let userToken = UserToken.load(tokenId);

      if (token != null && userToken != null) {
        if (event.params.amountPrimary != BigInt.fromI32(0) || event.params.amountSecondary != BigInt.fromI32(0)) {
          token.timesRewarded = token.timesRewarded + 1;
          userToken.timesRewardedUser = userToken.timesRewardedUser + 1;
        }
        
        if (event.params.amountPrimary != BigInt.fromI32(0)) {
          token.totalRewardPrimary = token.totalRewardPrimary.plus(amountPrimary);
          token.lastRewardPrimary = amountPrimary;

          userToken.totalPrimaryRewardUser = userToken.totalPrimaryRewardUser.plus(amountPrimary);
          userToken.lastRewardPrimaryUser = userToken.lastRewardPrimaryUser.plus(amountPrimary);
        }

        if (event.params.amountSecondary != BigInt.fromI32(0)) {
          token.totalRewardSecondary = token.totalRewardSecondary.plus(amountSecondary);
          token.lastRewardSecondary = amountSecondary;

          userToken.totalSecondaryRewardUser = userToken.totalSecondaryRewardUser.plus(amountSecondary);
          userToken.lastRewardSecondaryUser = userToken.lastRewardSecondaryUser.plus(amountSecondary);
        }

        token.save();
        userToken.save();
      }
    }
  }
}
