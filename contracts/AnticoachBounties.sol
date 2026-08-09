// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AnticoachBounties
 * @dev On-chain smart contract for ANTICOACH Life-Struggles Bounty System.
 * Tracks global USDT contributions for each category ID (0 to 10) and automatically
 * forwards donated USDT directly to the owner wallet.
 */

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AnticoachBounties {
    // Owner wallet that receives all donated funds directly
    address public immutable owner;
    
    // ERC-20 USDT Token Contract Address
    IERC20 public immutable usdtToken;

    // Total USDT raised per category ID (0 to 10) in USDT units (6 decimals)
    mapping(uint8 => uint256) public categoryRaisedUSDT;

    // Number of active categories
    uint8 public constant CATEGORY_COUNT = 11;

    // Events
    event DonationReceived(uint8 indexed categoryId, address indexed donor, uint256 amountUSDT);
    event DirectContribution(uint8 indexed categoryId, uint256 amountUSDT);

    constructor(address _usdtTokenAddress) {
        require(_usdtTokenAddress != address(0), "Invalid USDT token address");
        owner = 0x32f6f912133d4c36879c79a1415f2e1fb39432ee;
        usdtToken = IERC20(_usdtTokenAddress);
    }

    /**
     * @dev Donate USDT to a specific life struggle category ID (0 to 10).
     * Transfers USDT directly from donor to owner wallet and updates on-chain state.
     * @param categoryId Index of the category (0 to 10)
     * @param usdtAmount Amount in USDT (6 decimals, e.g. 10000000 = $10 USDT)
     */
    function donateToGoal(uint8 categoryId, uint256 usdtAmount) external {
        require(categoryId < CATEGORY_COUNT, "Invalid category ID");
        require(usdtAmount > 0, "Amount must be greater than 0");

        // Transfer USDT directly from donor to owner wallet
        bool success = usdtToken.transferFrom(msg.sender, owner, usdtAmount);
        require(success, "USDT transfer failed");

        // Record total on-chain
        categoryRaisedUSDT[categoryId] += usdtAmount;

        emit DonationReceived(categoryId, msg.sender, usdtAmount);
    }

    /**
     * @dev Allows owner to record manual/off-chain contributions to a category.
     * @param categoryId Index of the category (0 to 10)
     * @param usdtAmount Amount in USDT (6 decimals)
     */
    function recordManualContribution(uint8 categoryId, uint256 usdtAmount) external {
        require(msg.sender == owner, "Only owner can record manual contributions");
        require(categoryId < CATEGORY_COUNT, "Invalid category ID");
        
        categoryRaisedUSDT[categoryId] += usdtAmount;
        emit DirectContribution(categoryId, usdtAmount);
    }

    /**
     * @dev Returns total USDT raised for all 11 categories in a single RPC view call.
     * @return totals Array of uint256 totals for category IDs 0 to 10
     */
    function getAllCategoryTotals() external view returns (uint256[11] memory totals) {
        for (uint8 i = 0; i < CATEGORY_COUNT; i++) {
            totals[i] = categoryRaisedUSDT[i];
        }
    }
}
