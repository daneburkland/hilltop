import React, { useState } from "react";
import { Tooltip } from "react-tippy";

function Popover({ content, children, isOpen, close }) {
  return (
    <Tooltip
      title="webhook menu"
      html={content}
      arrow={true}
      position="right"
      open={isOpen}
      trigger="click"
      interactive={true}
      onRequestClose={() => close && close()}
    >
      {children}
    </Tooltip>
  );
}

export default Popover;
