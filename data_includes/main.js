// Author: Niranjana Hegde BS 
// Date: 27/09/2025
//Inspired by https://chuprinko-kirill.github.io/pcibex_tutorial/sprt.html and https://pryslopska.com/projects/lab_crab/pcibex/questionnaire/

PennController.ResetPrefix(null); // Shorten command names (keep this line here))
DebugOff(); // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
Sequence(
  "counter",
  "instructions",
  "prolific_id",
  "spr_instructions",
  "practice",
  "practice_end",
  "experiment",
  SendResults(),
  "end"
);
SetCounter("counter", "inc", 1);

Header(newVar("USER").global()).log("user_id", getVar("USER")); // Capture Prolific-ID and retain it for the trials

PennController(
  "instructions",
  newHtml("instructions", "instructions.html")
    .checkboxWarning(
      "Bitte stimmen Sie der Einwilligung zu, indem Sie das Kästchen ankreuzen."
    )
    .center()
    .print(),
  // this is required to actually display the content. Otherwise the element exists, but isn't visible
  newButton("next", "Weiter")
    .css({
      "margin-top": "20px",
      "padding": "6px 12px",
      "margin-bottom": "0",
      "font-size": "14px",
      "font-weight": "400",
      "line-height": "1.42857143",
      "text-align": "center",
      "white-space": "nowrap",
      "vertical-align": "middle",
      "-ms-touch-action": "manipulation",
      "touch-action": "manipulation",
      "cursor": "pointer",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "background-image": "none",
      "border": "1px solid transparent",
      "border-radius": "4px",
    })
    .print()
    .center()
    .wait(
      getHtml("instructions")
        .test.complete()
        .failure(getHtml("instructions").warn())
    )
  // wait() in general means that the element doesn't progress till a certain action is executed
);

newTrial(
  "prolific_id",
  defaultText.center().print(),
  newText("participant_info_header", "<p><b>Bitte geben Sie Ihre Prolific-ID ein.</b></p>").css({"font-size":"16px"}),
  newText("participantID", "Prolific-ID*").center().print(),
  newTextInput("input_ID").css({"margin": "2em 0"}).center().log().print(),
  newButton("next", "Weiter")
    .css({
      "margin-top": "20px",
      "padding": "6px 12px",
      "margin-bottom": "0",
      "font-size": "14px",
      "font-weight": "400",
      "line-height": "1.42857143",
      "text-align": "center",
      "white-space": "nowrap",
      "vertical-align": "middle",
      "-ms-touch-action": "manipulation",
      "touch-action": "manipulation",
      "cursor": "pointer",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "background-image": "none",
      "border": "1px solid transparent",
      "border-radius": "4px",
    })
    .center()
    .print()
    // Check whether Prolific-ID is entered
    .wait(
      newFunction("dummy", () => true)
        .test.is(true)
        // ID
        .and(getTextInput("input_ID").testNot.text(""))
    ),
  getVar("USER").set(getTextInput("input_ID"))
);

PennController(
  "spr_instructions",
  newHtml("spr_instructions", "spr_instructions.html").center().print(), // this is required to actually display the content. Otherwise the element exists, but isn't visible
  newButton("Weiter")
    .css({
      "margin-top": "20px",
      "padding": "6px 12px",
      "margin-bottom": "0",
      "font-size": "14px",
      "font-weight": "400",
      "line-height": "1.42857143",
      "text-align": "center",
      "white-space": "nowrap",
      "vertical-align": "middle",
      "-ms-touch-action": "manipulation",
      "touch-action": "manipulation",
      "cursor": "pointer",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "background-image": "none",
      "border": "1px solid transparent",
      "border-radius": "4px",
    })
    .bold()
    .center()
    .print()
    .wait() 
);

Template("practice.csv", (row) =>
  // This allows us to follow the same template for each row of a provided csv file
  newTrial(
    "practice",
    newText("insSpace", "Press Enter to start the sentence") 
      .cssContainer({
        "font-family": "serif",
        "font-size": "19px",
        "padding-top": "50px",
        "line-height": "400%",
      })
      .italic()
      .center()
      .print("center at 50vw", "middle at 40vh"),
    newKey("Enter").wait(),
    getText("insSpace") 
      .remove(),
    newController("DashedSentence", {
      s: row.sentence,
      mode: "self-paced reading",
      display: "in place",
      blankText: "X",
      hideUnderscores: true,
    })
      .center()
      .cssContainer({
        "font-family": "monospace",
        "font-size": "25px",
        "padding-top": "50px",
      })
      .print("center at 50vw", "middle at 40vh")
      .log()
      .wait()
      .remove(),

    newFunction("test_quest", () => row.question == "")
      .testNot.is()
      .failure(
        newText("question-sentence", row.question)
          .cssContainer({ "margin-bottom": "0em", "font-weight": "bold", "font-size": "25px" })
          .center()
          .print("center at 50vw", "middle at 37vh"),
        newScale("answer", "Yes", "No")
          .css("font-size", "1.5em", "center")
          .center()
          .button()
          .keys("D", "K")
          .print("center at 50vw", "middle at 45vh")
          .wait(), 
        getScale("answer")
          .test.selected(row.answer)
          .success(
            newText("feedback", "Right Answer")
            .cssContainer({"font-size": "20px"})
              .color("green")
              .print("center at 50vw", "middle at 30vh")
          )
          .failure(
            newText("feedback", "Wrong Answer")
            .cssContainer({"font-size": "20px"})
              .color("red")
              .print("center at 50vw", "middle at 35vh")
          ),
        newTimer("pause", 1000) // Brief pause to see feedback
          .start()
          .wait()
      )
  )
);

PennController(
  "practice_end",
  newHtml("practice_end", "practice_end.html").center().print(),
  newButton("Weiter")
    .css({
      "margin-top": "20px",
      "padding": "6px 12px",
      "margin-bottom": "0",
      "font-size": "14px",
      "font-weight": "400",
      "line-height": "1.42857143",
      "text-align": "center",
      "white-space": "nowrap",
      "vertical-align": "middle",
      "-ms-touch-action": "manipulation",
      "touch-action": "manipulation",
      "cursor": "pointer",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "background-image": "none",
      "border": "1px solid transparent",
      "border-radius": "4px",
    })
    .bold()
    .center()
    .print()
    .wait() 
);

Template("main.csv", (row) =>
  newTrial(
    "experiment",
    newText("insSpace", "Press Enter to start the sentence") 
      .cssContainer({
        "font-family": "serif",
        "font-size": "19px",
        "padding-top": "50px",
        "line-height": "400%",
      })
      .italic()
      .center()
      .print("center at 50vw", "middle at 40vh"),
    newKey("Enter").wait(),
    getText("insSpace") // With get text, we can make modifications to prior elements. Here, removing it. We have to remove it here, because the same element contains multiple text elements that will appear at the same spot.
      .remove(),

    newController("DashedSentence", {
      s: row.sentence,
      mode: "self-paced reading",
      display: "in place",
      blankText: "X",
      hideUnderscores: true,
    })
      .center()
      .cssContainer({
        "font-family": "monospace",
        "font-size": "25px",
        "padding-top": "50px",
      })
      .print("center at 50vw", "middle at 40vh")
      .log()
      .wait()
      .remove(),

    newFunction("test_quest", () => row.question == "")
      .testNot.is()
      .failure(
        newText("question-sentence", row.question)
          .cssContainer({ "margin-bottom": "0em", "font-weight": "bold", "font-size": "25px" })
          .center()
          .print("center at 50vw", "middle at 37vh"),
        newScale("answer", "Yes", "No")
          .css("font-size", "1.5em", "center")
          .center()
          .button()
          .keys("D", "K")
          .print("center at 50vw", "middle at 45vh")
          .wait(), 
          
        getScale("answer")
          .test.selected(row.answer)
          .success(
            newText("feedback", "Right Answer")
            .cssContainer({"font-size": "20px"})
              .color("green")
              .print("center at 50vw", "middle at 30vh")
          )
          .failure(
            newText("feedback", "Wrong Answer")
            .cssContainer({"font-size": "20px"})
              .color("red")
              .print("center at 50vw", "middle at 35vh")
          ),
      )
  )
    .log("SentenceID", row.SentenceID) // Or the column you want to retain
    .log("SentenceID", row.SentenceID) // Or the column you want to retain
    .log("Type", row.Type) // Or the column you want to retain
);

PennController(
  "end",
  newHtml("end", "end.html").center().print(), // this is required to actually display the content. Otherwise the element exists, but isn't visible
  newButton("<a href='https://google.com'>Next</a>")
    .css({
      "margin-top": "20px",
      "padding": "6px 12px",
      "margin-bottom": "0",
      "font-size": "14px",
      "font-weight": "400",
      "line-height": "1.42857143",
      "text-align": "center",
      "white-space": "nowrap",
      "vertical-align": "middle",
      "-ms-touch-action": "manipulation",
      "touch-action": "manipulation",
      "cursor": "pointer",
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "background-image": "none",
      "border": "1px solid transparent",
      "border-radius": "4px",
    })
    .bold()
    .center()
    .print()
    .wait() // wait() in general means that the element doesn't progress till a certain action is executed
);



