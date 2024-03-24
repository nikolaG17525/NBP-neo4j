using Neo4j.Driver;
using Neo4jTest.Models;
using System.Security.Principal;

namespace Neo4jTest
{
    public class Neo4jService
    {
        private readonly IDriver _driver;

        public Neo4jService(IConfiguration configuration)
        {
            var neo4jSettings = configuration.GetSection("Neo4jSettings");
            var uri = neo4jSettings["Uri"];
            var username = neo4jSettings["UserName"];
            var password = neo4jSettings["Password"];

            _driver = GraphDatabase.Driver(uri, AuthTokens.Basic(username, password));
        }

        public IAsyncSession GetSession()
        {
            return _driver.AsyncSession();
        }


        public async Task<List<Player>> GetPlayers(string teamName)
        {
            List<Player> players = new List<Player>();

            // Pretpostavka: _driver je objekat Neo4j driver-a koji predstavlja konekciju sa bazom podataka
            var session = _driver.AsyncSession();
            try
            {
                var query = $"MATCH (n:PLAYER) - [:PLAYS_FOR] -> (t:TEAM) WHERE t.name = '{teamName}' RETURN n.name, n.isCaptain, n.number, n.position, n.birthYear"; // Prilagodite ovo vašim potrebama
                var cursor = await session.RunAsync(query);

                while (await cursor.FetchAsync())
                {
                    var record = cursor.Current;
                    Player p = new Player();
                    p.Name = record["n.name"].As<string>();
                    p.IsCaptain = record["n.isCaptain"].As<bool>();
                    p.Number = record["n.number"].As<int>();
                    p.Position = record["n.position"].As<string>();
                    p.BirthYear = record["n.birthYear"].As<int>();
                    players.Add(p);
                }

            }
            finally
            {
                await session.CloseAsync();
            }

            return players;
        }

        public async Task<List<Game>> GetGames(string teamName, string side)
        {
            List<Game> games = new List<Game>();

            // Pretpostavka: _driver je objekat Neo4j driver-a koji predstavlja konekciju sa bazom podataka
            var session = _driver.AsyncSession();
            try
            {
                string query;

                if (side == "home")
                {
                    query = $"MATCH (t1:TEAM) -[game:PLAYED_AGAINST] -> (t2:TEAM) WHERE t1.name = '{teamName}' AND game.side = 'home' RETURN t1.name AS host, game.host AS host_score, game.guest AS guest_score, t2.name AS guest, game.round AS round ";
                    
                } 
                else
                {
                    query = $"MATCH (t1:TEAM) -[game:PLAYED_AGAINST] -> (t2:TEAM) WHERE t1.name = '{teamName}' AND game.side = 'away' RETURN t2.name AS host, game.host AS host_score, game.guest AS guest_score, t1.name AS guest, game.round AS round ";
                    
                }

                var cursor = await session.RunAsync(query);

                while (await cursor.FetchAsync())
                {
                    var record = cursor.Current;
                    Game game = new Game();
                    game.Host = record["host"].As<string>();
                    game.Guest = record["guest"].As<string>();
                    game.HostGoals = record["host_score"].As<int>();
                    game.GuestGoals = record["guest_score"].As<int>();
                    game.Round = record["round"].As<int>();
                    
                    games.Add(game);
                }

            }
            finally
            {
                await session.CloseAsync();
            }

            return games;
        }

        public async Task<List<Club>> GetClubs()
        {
            List<Club> clubs = new List<Club>();

            
            var session = _driver.AsyncSession();
            try
            {
                string query;

                query = "MATCH (t:TEAM) RETURN t.name AS name, t.points AS points ORDER BY t.points DESC";

                var cursor = await session.RunAsync(query);

                while (await cursor.FetchAsync())
                {
                    var record = cursor.Current;
                    Club club = new Club();
                    club.Name = record["name"].As<string>();
                    club.Points = record["points"].As<int>();
                    

                    clubs.Add(club);
                }

            }
            finally
            {
                await session.CloseAsync();
            }

            return clubs;
        }

        public async Task<List<Coach>> GetCoaches()
        {
            List<Coach> coaches = new List<Coach>();


            var session = _driver.AsyncSession();
            try
            {
                string query;

                query = "MATCH (c:COACH) RETURN c.name AS name";

                var cursor = await session.RunAsync(query);

                while (await cursor.FetchAsync())
                {
                    var record = cursor.Current;
                    Coach coach = new Coach();
                    coach.Name = record["name"].As<string>();
                    
                    coaches.Add(coach);
                }

            }
            finally
            {
                await session.CloseAsync();
            }

            return coaches;
        }

        public async Task<List<Coach>> GetFreeCoaches()
        {
            List<Coach> coaches = new List<Coach>();


            var session = _driver.AsyncSession();
            try
            {
                string query;

                query = "MATCH (coach:COACH) WHERE NOT EXISTS {MATCH (coach)-[:COACHES]->(:TEAM)} RETURN coach.name";

                var cursor = await session.RunAsync(query);

                while (await cursor.FetchAsync())
                {
                    var record = cursor.Current;
                    Coach coach = new Coach();
                    coach.Name = record["coach.name"].As<string>();

                    coaches.Add(coach);
                }

            }
            finally
            {
                await session.CloseAsync();
            }

            return coaches;
        }

        public async Task SetNewCoach(string teamName, string coachName)
        {

            var session = _driver.AsyncSession();
            try
            {
                string query1;

                query1 = $"MATCH (coach:COACH)-[coaches:COACHES]->(team:TEAM) WHERE team.name = '{teamName}' DELETE coaches";

                await session.RunAsync(query1);

                string query2;

                query2 = $"MATCH (coach:COACH), (team:TEAM) WHERE coach.name = '{coachName}' AND team.name = '{teamName}' CREATE (coach)-[:COACHES]->(team)";

                await session.RunAsync(query2);

            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task CreateNewGame(string hostName, int hostGoals, string guestName, int guestGoals, int round)
        {

            var session = _driver.AsyncSession();
            try
            {
                string query = @"
                        MATCH (t1:TEAM {name: $hostName}), (t2:TEAM {name: $guestName})
                        CREATE (t1)-[:PLAYED_AGAINST {host: $hostGoals, guest: $guestGoals, side: 'home', round: $round}]->(t2), 
                        (t2)-[:PLAYED_AGAINST {host: $hostGoals, guest: $guestGoals, side: 'away', round: $round}]->(t1)";

                var parameters = new
                {
                    hostName,
                    hostGoals,
                    guestName,
                    guestGoals,
                    round
                };

                await session.RunAsync(query, parameters);

                string query2;

                if (hostGoals > guestGoals) { query2 = $"MATCH (t:TEAM) WHERE t.name = '{hostName}' SET t.points = t.points + 3"; } 
                else if (guestGoals > hostGoals) { query2 = $"MATCH (t:TEAM) WHERE t.name = '{guestName}' SET t.points = t.points + 3"; }
                else { query2 = $"MATCH (t:TEAM) WHERE t.name = '{guestName}' OR t.name = '{hostName}' SET t.points = t.points + 1"; }

                await session.RunAsync(query2);

            }
            finally
            {
                await session.CloseAsync();
            }
        }

        public async Task DeleteCoach(string coachName)
        {
            var session = _driver.AsyncSession();
            try
            {
                string query = $"MATCH (c:COACH) WHERE c.name = '{coachName}' DETACH DELETE c";

                await session.RunAsync(query);

            }
            finally
            {
                await session.CloseAsync();
            }
        }


    }
}
