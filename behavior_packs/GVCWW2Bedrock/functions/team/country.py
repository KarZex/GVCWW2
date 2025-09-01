teams_true = [ "GER","USA","JAP","ENG" ]
teams = [ "ger","usa","jap","eng" ]

for i in range(len(teams)):
    with open("setTeamSOV.mcfunction","r") as f:
        global_text = f.read()
        output = global_text.replace("SOV", teams_true[i]).replace("sov", teams[i])

    with open(f"setTeam{teams_true[i]}.mcfunction","w") as f:
        f.write(output)