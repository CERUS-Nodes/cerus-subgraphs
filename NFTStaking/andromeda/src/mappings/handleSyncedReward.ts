import { SyncedReward as SyncedRewardEvent } from "../../generated/Contract/CERUSNFTStaking";
import { SyncedReward } from "../../generated/schema";

export function handleSyncedReward(event: SyncedRewardEvent): void {
  let entity = new SyncedReward(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.amountPrimary = event.params.amountPrimary;
  entity.amountSecondary = event.params.amountSecondary;
  entity.timeInSeconds = event.params.timeInSeconds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
