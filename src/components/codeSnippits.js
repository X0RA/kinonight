export const latexCode = `
% Basic packages
\\usepackage[margin=1in]{geometry}  % Set page margins
\\usepackage{parskip}  % Set paragraph spacing

% Page header and footer
\\usepackage{fancyhdr}
\\pagestyle{fancy}

% Graphics and images
\\usepackage{graphicx}  % Enhanced graphics support
\\usepackage[export]{adjustbox}  % Adjusting images
\\graphicspath{ {./images/} }  % Set the path for image files
\\usepackage{wrapfig}
\\usepackage{subcaption}

% For table
\\usepackage{longtable}
\\usepackage{color}
\\usepackage{tabularray}
\\usepackage{rotating}

% Code snippets
\\usepackage{listings}  % Typesetting code
\\usepackage{xcolor}  % Custom colors for code listings
\\usepackage{wrapfig}  % Wrapping text around figures

% Code listing style
\\definecolor{codegreen}{rgb}{0,0.6,0}
\\definecolor{codegray}{rgb}{0.5,0.5,0.5}
\\definecolor{codepurple}{rgb}{0.58,0,0.82}
\\definecolor{backcolour}{rgb}{0.95,0.95,0.92}
\\lstdefinestyle{mystyle}{
    backgroundcolor=\\color{backcolour},
    commentstyle=\\color{codegreen},
    keywordstyle=\\color{magenta},
    numberstyle=\\tiny\\color{codegray},
    stringstyle=\\color{codepurple},
    basicstyle=\\ttfamily\\footnotesize,
    breakatwhitespace=false,
    breaklines=true,
    captionpos=b,
    keepspaces=true,
    numbers=left,
    numbersep=5pt,
    showspaces=false,
    showstringspaces=false,
    showtabs=false,
    tabsize=2
}
\\lstset{style=mystyle}

% Hyperlinks and bibliography
% \\usepackage{hyperref}  % Hyperlinks within the document
% \\hypersetup{colorlinks=false}  % Disable colored links
\\usepackage[colorlinks=true,linkcolor=black]{hyperref}
\\usepackage[numbers]{natbib}  % Author-year citation style with numbered references
`;

export const taskCode = `
  \\documentclass[12pt]{article}
  \\input{Template.tex}
  % Document header information
  \\newcommand{\\task}{task identifier}  % Set the task variable
  \\lhead{class identifier - \\textbf{\\task}}  % Left side header
  \\chead{name - student code}  % Center header
  \\rhead{\\today}  % Right side header
  \\setcitestyle{square}  % Set citation style
  
  
  \\begin{document}
  
  \\begin{titlepage}
  \\centering
  
  \\vspace*{\\fill}
  
  {\\Huge\\bfseries title of report\\par}
  \\vspace{1cm}
  {\\Large name - student code\\par}
  \\vspace{1cm}
  {\\Large \\textit{class - task}\\par}
  
  \\vspace*{\\fill}
  
  \\end{titlepage}
  
  
  
  \\end{document}
`;
