import React from 'react';
import { Tooltip } from 'react-tooltip';

import styles from './styles.module.css';

/**
 * @param {string} id - The id of the tooltip
 * @param {string} term - The term to display in the tooltip
 * @param {React.ReactNode} children - The children to display in the tooltip
 * @returns {React.ReactNode}
 *
 * @example
 * ```
 * Here is a term with a <Tooltip id="pkp" term="A programmable key pair that can be controlled by multiple authentication methods">PKP</Tooltip>.
 * ```
 */
export default function TooltipComponent({ id, term, children }) {
  return (
    <>
      <span data-tooltip-id={id} className={styles.tooltipTrigger}>
        {children}
      </span>
      <Tooltip id={id} className={styles.tooltip} place="top">
        {term}
      </Tooltip>
    </>
  );
}
