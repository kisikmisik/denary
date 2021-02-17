"use strict";

export class Authorization {

  private permisions;

  constructor(permisions: object[]) {
    this.permisions = permisions;
  }

  public isAdmin() {
    for (const line of this.permisions) {
      if (line.name === "Admin" ) { return true; } }
    return false;
    }

  }
