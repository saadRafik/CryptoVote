import { expect } from "chai";
import { ethers } from "hardhat";
import { Admin } from "../typechain-types";

describe("Admin", function () {
  let admin: Admin;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    const Admin = await ethers.getContractFactory("Admin");
    [owner, addr1, addr2] = await ethers.getSigners();
    admin = await Admin.deploy();
    await admin.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await admin.owner()).to.equal(owner.address);
    });
  });

  describe("Whitelist", function () {
    it("Should add an address to the whitelist", async function () {
      await admin.whitelist(addr1.address);
      expect(await admin.isWhitelisted(addr1.address)).to.be.true;
    });

    it("Should emit Whitelisted event", async function () {
      await expect(admin.whitelist(addr1.address))
        .to.emit(admin, "Whitelisted")
        .withArgs(addr1.address);
    });

    it("Should revert if address is already whitelisted", async function () {
      await admin.whitelist(addr1.address);
      await expect(admin.whitelist(addr1.address)).to.be.revertedWith(
        "This address is already whitelisted !"
      );
    });

    it("Should revert if address is blacklisted", async function () {
      await admin.blacklist(addr1.address);
      await expect(admin.whitelist(addr1.address)).to.be.revertedWith(
        "This address is already blacklisted !"
      );
    });
  });

  describe("Blacklist", function () {
    it("Should add an address to the blacklist", async function () {
      await admin.blacklist(addr1.address);
      expect(await admin.isBlacklisted(addr1.address)).to.be.true;
    });

    it("Should emit Blacklisted event", async function () {
      await expect(admin.blacklist(addr1.address))
        .to.emit(admin, "Blacklisted")
        .withArgs(addr1.address);
    });

    it("Should revert if address is already blacklisted", async function () {
      await admin.blacklist(addr1.address);
      await expect(admin.blacklist(addr1.address)).to.be.revertedWith(
        "This address is already blacklisted !"
      );
    });

    it("Should revert if address is whitelisted", async function () {
      await admin.whitelist(addr1.address);
      await expect(admin.blacklist(addr1.address)).to.be.revertedWith(
        "This address is already whitelisted !"
      );
    });
  });

  describe("Access Control", function () {
    it("Should revert if non-owner tries to whitelist", async function () {
      await expect(admin.connect(addr1).whitelist(addr2.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should revert if non-owner tries to blacklist", async function () {
      await expect(admin.connect(addr1).blacklist(addr2.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should revert if non-owner tries to check whitelist", async function () {
      await expect(admin.connect(addr1).isWhitelisted(addr2.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should revert if non-owner tries to check blacklist", async function () {
      await expect(admin.connect(addr1).isBlacklisted(addr2.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });
});
