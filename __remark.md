# Vue 3 + Vite

 let main_window = WindowBuilder::new(
                app,
                "main",
                WindowUrl::App("index.html".into())
            )
            .with_initialization_script(r#"
                window.myCustomObject = {
                    sayHello: function() {
                        console.log("Hello from custom object!");
                    }
                };
            "#)
            .build()?;



            <!DOCTYPE html>
<html> 
    <head>
        <title>Home</title>
    </head>
    <body>
        <div style="display: flex; gap: 4px;">
            <style>
              .button { cursor: pointer; }
              .shape { display: none; }
              .button:hover .shape { display: block; }
              .button:hover .circle-close { fill: #FF3B30; }
              .button:hover .circle-minimize { fill: #FFD700; }
              .button:hover .circle-maximize { fill: #28c840; }
            </style>
          
            <!-- Close button -->
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g class="button">
                <circle cx="8" cy="8" r="6" fill="#FF605C" stroke="#E44D3A" stroke-width="1" class="circle-close"/>
                <line x1="5" y1="5" x2="11" y2="11" stroke="#7b634c" stroke-width="1" class="shape"/>
                <line x1="5" y1="11" x2="11" y2="5" stroke="#7b634c" stroke-width="1" class="shape"/>
              </g>
            </svg>
          
            <!-- Minimize button -->
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g class="button">
                <circle cx="8" cy="8" r="6" fill="#FFBD44" stroke="#E1A737" stroke-width="1" class="circle-minimize"/>
                <line x1="5" y1="8" x2="11" y2="8" stroke="#7b634c" stroke-width="1" class="shape"/>
              </g>
            </svg>
          
            <!-- Maximize button -->
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
              <g class="button">
                <circle cx="8" cy="8" r="6" fill="#00CA4E" stroke="#00A743" stroke-width="1" class="circle-maximize"/>
                <line x1="5" y1="8" x2="11" y2="8" stroke="#7b634c" stroke-width="1" class="shape"/>
                <line x1="8" y1="5" x2="8" y2="11" stroke="#7b634c" stroke-width="1" class="shape"/>
              </g>
            </svg>
        </div>
    </body> 
</html>