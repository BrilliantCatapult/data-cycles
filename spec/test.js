describe("A suite", function() {
  it("should pass a test", function() {
    console.log("tested");
    expect(true).toBe(true);
  });

  it("should do a thing", function() {
    var b = 5;
    expect(b).toBe(5);
  });
});