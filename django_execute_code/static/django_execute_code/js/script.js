Array.prototype.includes = function(value) {
  return this.indexOf(value) !== -1
}
String.prototype.characterize = function(callback) {
  var characters = this.split('');
  var options = {};

  for (var i = 0; i < this.length; i++) {
    options = callback(characters[i]);
  }
}

var $textarea;
var $highlight;

var $keywords = ['False', 'None', 'True', 'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'];

var $functions = ['ArithmeticError','AssertionError','AttributeError','BaseException','BlockingIOError','BrokenPipeError','BufferError','BytesWarning','ChildProcessError','ConnectionAbortedError','ConnectionError','ConnectionRefusedError','ConnectionResetError','DeprecationWarning','EOFError','Ellipsis','EnvironmentError','Exception','False','FileExistsError','FileNotFoundError','FloatingPointError','FutureWarning','GeneratorExit','IOError','ImportError','ImportWarning','IndentationError','IndexError','InterruptedError','IsADirectoryError','KeyError','KeyboardInterrupt','LookupError','MemoryError','ModuleInvokeAll','ModuleNotFoundError','NameError','None','NotADirectoryError','NotImplemented','NotImplementedError','OSError','OverflowError','PendingDeprecationWarning','PermissionError','ProcessLookupError','RecursionError','ReferenceError','ResourceWarning','RuntimeError','RuntimeWarning','StopAsyncIteration','StopIteration','SyntaxError','SyntaxWarning','SystemError','SystemExit','TabError','TimeoutError','True','TypeError','UnboundLocalError','UnicodeDecodeError','UnicodeEncodeError','UnicodeError','UnicodeTranslateError','UnicodeWarning','UserWarning','ValueError','Warning','ZeroDivisionError','__build_class__','__debug__','__doc__','__import__','__loader__','__name__','__package__','__spec__','abs','all','any','ascii','bin','bool','bytearray','bytes','callable','chr','classmethod','compile','complex','copyright','credits','delattr','dict','dir','divmod','enumerate','eval','exec','exit','filter','float','format','frozenset','getattr','globals','hasattr','hash','help','hex','id','input','int','isinstance','issubclass','iter','len','license','list','locals','log_watchdog','map','max','memoryview','min','next','object','oct','open','ord','pow','pp','print','property','quit','range','repr','reversed','round','set','setattr','slice','sorted','st','staticmethod','str','sum','super','trace_exception','tuple','type','vars','zip'];

window.addEventListener('load', function() {
  $textarea = document.getElementById('id_code');
  $highlight = document.getElementById('highlight-area');
  var code = `${$textarea.innerHTML}`;

  var triggerHighlight = function() {
    var tokens = tokenize($textarea.value);
    $highlight.innerHTML = '';
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var span = document.createElement('span');
      span.className = 'highlight-' + token.type;
      span.innerText = token.value;
      $highlight.appendChild(span);
    }
    var lines = $textarea.value.split('\n');
    if (lines[lines.length - 1] === '') {
      var br = document.createElement('br');
      $highlight.appendChild(br);
    }
    $highlight.scrollTop = $textarea.scrollTop;
  };

  $textarea.addEventListener('input', triggerHighlight);
  $textarea.addEventListener('scroll', function(event) {
    $highlight.scrollTop = this.scrollTop;
  });

  var tabCode = 9;
  var leftParenthesisCode = 40;
  $textarea.addEventListener('keydown', function(event) {
    switch(event.keyCode) {
      case tabCode:
        event.preventDefault();
        this.value += '    ';
        break;
    }
  });

  $textarea.textContent = code;
  $highlight.textContent = code;
  triggerHighlight()
});

function tokenize(inputString) {
  var tokens = [];
  var lexedValue = '';
  var currentToken = null;

  function newSpaceToken() {
    currentToken = { type: 'space', value: ' ' };
    lexedValue = '';
  }

  function parseLexedValueToToken() {
    if (lexedValue) {
      if ($keywords.includes(lexedValue)) {
        tokens.push({ type: 'keyword', value: lexedValue })
      } else if ($functions.includes(lexedValue)) {
        tokens.push({ type: 'function', value: lexedValue })
      } else if (lexedValue !== '') {
        if (isNaN(lexedValue)) {
          tokens.push({ type: 'default', value: lexedValue })
        } else {
          tokens.push({ type: 'number', value: lexedValue })
        }
      }
      lexedValue = '';
    }
  }

  function lex(char) {
    if (char !== ' ' && currentToken && currentToken.type === 'space' ) {
      tokens.push(currentToken);
      lexedValue = '';
      currentToken = null;
    }

    switch(char) {
      case ' ':
        if ($keywords.includes(lexedValue)) {
          tokens.push({ type: 'keyword', value: lexedValue })
          newSpaceToken();
        } else if ($functions.includes(lexedValue)) {
          tokens.push({ type: 'function', value: lexedValue })
          newSpaceToken();
        } else if (lexedValue !== '') {
          if (isNaN(lexedValue)) {
            tokens.push({ type: 'default', value: lexedValue })
          } else {
            tokens.push({ type: 'number', value: lexedValue })
          }
          newSpaceToken();
        } else if (currentToken) {
          currentToken.value += ' '
        } else {
          newSpaceToken();
        }
        break;
      
      case '"':
      case '\'':
        if (currentToken) {
          if (currentToken.type === 'string') {
            if (currentToken.value[0] === char) {
              currentToken.value += char
              tokens.push(currentToken)
              currentToken = null;
            } else {
              currentToken.value += char
            }
          } else if (currentToken.type === 'comment') {
            currentToken.value += char
          }
        } else {
          if (lexedValue) {
            tokens.push({ type: 'default', value: lexedValue });
            lexedValue = '';
          }
          currentToken = { type: 'string', value: char }
        }
        break;

      case '=':
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '&':
      case '|':
      case '>':
      case '<':
      case '!':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'operator', value: char })
        }
        break;

      case '#':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          currentToken = { type: 'comment', value: char }
        }
        break;

      case ':':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'colon', value: char });
        }
        break;
      
      case '(':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'left-parentheses', value: char });
        }
        break;

      case ')':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'right-parentheses', value: char });
        }
        break;

      case '[':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'left-bracket', value: char });
        }
        break;

      case ']':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'right-bracket', value: char });
        }
        break;

      case ',':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'comma', value: char });
        }
        break;

      case '\n':
        if (currentToken) {
          switch(currentToken.type) {
            case 'string':
            case 'comment':
              tokens.push(currentToken)
              currentToken = null;
              break;
            default:
          }
        } else {
          parseLexedValueToToken();
          lexedValue = '';
        }
        tokens.push({ type: 'newline', value: '\n' });
        break;
        
      case ';':
        if (currentToken) {
          currentToken.value += char;
        } else {
          parseLexedValueToToken();
          tokens.push({ type: 'semicolon', value: char });
        }
        break;

      default:
        if (currentToken) {
          currentToken.value += char;
        } else {
          lexedValue += char
        }

        break;
    }
  }

  /* Lexing the input codes */
  inputString.characterize(lex);

  /* Rest of the lexed value or token which is unfinished */
  parseLexedValueToToken();

  if (currentToken) tokens.push(currentToken)

  /* Secondary Parse to Match Some Patterns */
  var isFunctionArgumentScope = false;
  var tokenCount = tokens.length;
  for (var i = 0; i < tokenCount; i++) {
    var token = tokens[i];
    if (token.type === 'keyword' && (token.value === 'def' || token.value === 'class')) {
      var peekToken = tokens[i + 2]
      if (peekToken && peekToken.type === 'default') peekToken.type = 'function-name';
    } else if (token.type === 'default' && isFunctionArgumentScope) {
      token.type = 'argument';
    } else if (token.type === 'left-parentheses') {
      var peekToken = tokens[i - 1]
      if (peekToken && peekToken.type === 'function-name') isFunctionArgumentScope = true;
    } else if (token.type === 'right-parentheses') {
      isFunctionArgumentScope = false;
    }
  }

  return tokens
}
