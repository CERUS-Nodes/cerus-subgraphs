import { handleDeposit } from "./mappings/handleDeposit";
import { handleClaim } from "./mappings/handleClaim";
import { handleWithdraw } from "./mappings/handleWithdraw";

export {
  handleDeposit,
  handleWithdraw,
  // handleCollectionAdded,
  // handleReward,
  handleClaim,
  // handleRewardAdded,
  // handleRetrieveToken,
};

import {
  Claim as ClaimEvent,
  Deposit as DepositEvent,
  EmergencyWithdraw as EmergencyWithdrawEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SyncedReward as SyncedRewardEvent,
  Withdraw as WithdrawEvent
} from "../generated/Contract/CERUSNFTStaking"

import {
  Claim,
  Deposit,
  EmergencyWithdraw,
  OwnershipTransferred,
  SyncedReward,
  Withdraw
} from "../generated/schema"

// export function handleDeposit(event: DepositEvent): void {
//   let entity = new Deposit(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   )
//   entity.user = event.params.user
//   entity.tokenId = event.params.tokenId

//   entity.blockNumber = event.block.number
//   entity.blockTimestamp = event.block.timestamp
//   entity.transactionHash = event.transaction.hash

//   entity.save()
// }

export function handleEmergencyWithdraw(event: EmergencyWithdrawEvent): void {
  let entity = new EmergencyWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.user = event.params.user
  entity.tokenIds = event.params.tokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSyncedReward(event: SyncedRewardEvent): void {
  let entity = new SyncedReward(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amountPrimary = event.params.amountPrimary
  entity.amountSecondary = event.params.amountSecondary
  entity.timeInSeconds = event.params.timeInSeconds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
