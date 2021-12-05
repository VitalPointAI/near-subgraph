import { near, BigInt, log } from "@graphprotocol/graph-ts";
import { Account } from "../generated/schema";

export function handleReceipt(receipt: near.ReceiptWithOutcome): void {
  const actions = receipt.receipt.actions;
  for (let i = 0; i < actions.length; i++) {
    handleAction(
      actions[i], 
      receipt.receipt, 
      receipt.block.header,
      receipt.outcome
      );
  }
}

function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader,
  outcome: near.ExecutionOutcome
): void {
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  const functionCall = action.toFunctionCall();

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "putDID") {
      const receiptId = receipt.id.toHexString()
      let account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.actionLogs = outcome.logs
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

  // change the methodName here to the methodName emitting the log in the contract
  if (functionCall.methodName == "init") {
      const receiptId = receipt.id.toHexString()
      let account = new Account(receipt.signerId);
      account.accountId = receipt.signerId;
      account.actionLogs = outcome.logs     
      account.save();
  } else {
    log.info("Not processed - FunctionCall is: {}", [functionCall.methodName]);
  }

}
