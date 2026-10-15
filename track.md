1. frontend url validation -> implemented
    - implemented with debouce with user inpdut delay 
    - protocol validation 

2. Custom aliases ->
    - two way check to be unique aliases
    - when user enter shortcode then check in db is exist or not , but this can race condtion 
    - to solve race condition , in  mongose schema  keep shortcode uniqueness 
