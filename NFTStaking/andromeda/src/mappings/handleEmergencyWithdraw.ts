import { EmergencyWithdraw as EmergencyWithdrawEvent } from "../../generated/Contract/CERUSNFTStaking";
import { EmergencyWithdraw } from "../../generated/schema";

export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let entity = new EmergencyWithdraw(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.user = event.params.user;
  entity.tokenIds = event.params.tokenIds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
