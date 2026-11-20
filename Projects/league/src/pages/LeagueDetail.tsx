import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, ArrowLeft, Plus, Trash2, Shuffle, Share2, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { generateFixtures, calculateTable, type Team, type Match, type TableEntry } from "@/lib/league-utils";

const LeagueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [league, setLeague] = useState<{ name: string; owner_id: string } | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [newTeam, setNewTeam] = useState("");
  const [addingTeam, setAddingTeam] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) fetchAll();
  }, [id]);

  useEffect(() => {
    if (league && user) setIsOwner(league.owner_id === user.id);
  }, [league, user]);

  const fetchAll = async () => {
    const [leagueRes, teamsRes, matchesRes] = await Promise.all([
      supabase.from("leagues").select("name, owner_id").eq("id", id!).single(),
      supabase.from("teams").select("id, name").eq("league_id", id!).order("created_at"),
      supabase.from("matches").select("*").eq("league_id", id!).order("round").order("id"),
    ]);

    if (leagueRes.error) {
      toast({ title: "League not found", variant: "destructive" });
      navigate("/dashboard");
      return;
    }

    setLeague(leagueRes.data);
    setTeams(teamsRes.data || []);
    setMatches(
      (matchesRes.data || []).map((m: any) => ({
        id: m.id,
        round: m.round,
        homeTeam: m.home_team,
        awayTeam: m.away_team,
        homeScore: m.home_score,
        awayScore: m.away_score,
        played: m.played,
      }))
    );
  };

  const addTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.trim()) return;
    setAddingTeam(true);
    const { error } = await supabase.from("teams").insert({ name: newTeam.trim(), league_id: id! });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewTeam("");
      fetchAll();
    }
    setAddingTeam(false);
  };

  const removeTeam = async (teamId: string) => {
    await supabase.from("teams").delete().eq("id", teamId);
    fetchAll();
  };

  const generateAndSaveFixtures = async () => {
    if (teams.length < 2) {
      toast({ title: "Need at least 2 teams", variant: "destructive" });
      return;
    }

    // Delete old matches
    await supabase.from("matches").delete().eq("league_id", id!);

    const fixtures = generateFixtures(teams);
    const rows = fixtures.map(f => ({
      league_id: id!,
      round: f.round,
      home_team: f.homeTeam,
      away_team: f.awayTeam,
      home_score: null,
      away_score: null,
      played: false,
    }));

    const { error } = await supabase.from("matches").insert(rows);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Fixtures generated!" });
      fetchAll();
    }
  };

  const updateScore = async (matchId: string, homeScore: number, awayScore: number) => {
    await supabase
      .from("matches")
      .update({ home_score: homeScore, away_score: awayScore, played: true })
      .eq("id", matchId);
    fetchAll();
  };

  const shareLink = `${window.location.origin}/league/${id}`;
  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const table = calculateTable(teams, matches);
  const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);

  if (!league && !authLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(user ? "/dashboard" : "/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-heading font-bold text-foreground truncate max-w-[200px]">{league?.name}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={copyLink}>
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : "Share"}
          </Button>
        </div>
      </nav>

      <div className="container py-6">
        <Tabs defaultValue="standings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
            {isOwner && <TabsTrigger value="teams">Teams</TabsTrigger>}
          </TabsList>

          {/* Standings */}
          <TabsContent value="standings">
            <Card>
              <CardHeader>
                <CardTitle>League Table</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {table.length === 0 ? (
                  <p className="p-6 text-center text-muted-foreground">Add teams and generate fixtures to see standings.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8">#</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead className="text-center">P</TableHead>
                          <TableHead className="text-center">W</TableHead>
                          <TableHead className="text-center">D</TableHead>
                          <TableHead className="text-center">L</TableHead>
                          <TableHead className="text-center">GF</TableHead>
                          <TableHead className="text-center">GA</TableHead>
                          <TableHead className="text-center">GD</TableHead>
                          <TableHead className="text-center font-bold">Pts</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {table.map((entry, i) => (
                          <TableRow key={entry.team} className={i === 0 ? "bg-primary/5" : ""}>
                            <TableCell className="font-medium">{i + 1}</TableCell>
                            <TableCell className="font-medium">{entry.team}</TableCell>
                            <TableCell className="text-center">{entry.played}</TableCell>
                            <TableCell className="text-center">{entry.wins}</TableCell>
                            <TableCell className="text-center">{entry.draws}</TableCell>
                            <TableCell className="text-center">{entry.losses}</TableCell>
                            <TableCell className="text-center">{entry.goalsFor}</TableCell>
                            <TableCell className="text-center">{entry.goalsAgainst}</TableCell>
                            <TableCell className="text-center">{entry.goalDifference > 0 ? "+" : ""}{entry.goalDifference}</TableCell>
                            <TableCell className="text-center font-bold">{entry.points}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fixtures */}
          <TabsContent value="fixtures">
            {isOwner && matches.length === 0 && teams.length >= 2 && (
              <div className="text-center mb-6">
                <Button onClick={generateAndSaveFixtures}>
                  <Shuffle className="h-4 w-4 mr-1" /> Generate Fixtures
                </Button>
              </div>
            )}
            {matches.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {teams.length < 2 ? "Add at least 2 teams first." : "Click 'Generate Fixtures' to create the schedule."}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {rounds.map(round => (
                  <Card key={round}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Round {round}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {matches.filter(m => m.round === round).map(match => (
                        <MatchRow key={match.id} match={match} isOwner={isOwner} onUpdate={updateScore} />
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Teams */}
          {isOwner && (
            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Teams ({teams.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={addTeam} className="flex gap-2">
                    <Input value={newTeam} onChange={e => setNewTeam(e.target.value)} placeholder="Team name" maxLength={50} className="max-w-xs" />
                    <Button type="submit" disabled={addingTeam} size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </form>
                  {teams.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No teams yet. Add your first team above.</p>
                  ) : (
                    <div className="space-y-2">
                      {teams.map(team => (
                        <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <span className="font-medium">{team.name}</span>
                          {matches.length === 0 && (
                            <Button variant="ghost" size="icon" onClick={() => removeTeam(team.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {teams.length >= 2 && (
                    <Button onClick={generateAndSaveFixtures} className="mt-4">
                      <Shuffle className="h-4 w-4 mr-1" /> {matches.length > 0 ? "Regenerate Fixtures" : "Generate Fixtures"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

const MatchRow = ({ match, isOwner, onUpdate }: { match: Match; isOwner: boolean; onUpdate: (id: string, h: number, a: number) => void }) => {
  const [homeScore, setHomeScore] = useState(match.homeScore?.toString() ?? "");
  const [awayScore, setAwayScore] = useState(match.awayScore?.toString() ?? "");
  const [editing, setEditing] = useState(false);

  const save = () => {
    const h = parseInt(homeScore);
    const a = parseInt(awayScore);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;
    onUpdate(match.id, h, a);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
      <span className="flex-1 text-right text-sm font-medium truncate">{match.homeTeam}</span>
      {isOwner && (editing || !match.played) ? (
        <div className="flex items-center gap-1">
          <Input
            className="w-12 text-center h-8 text-sm"
            value={homeScore}
            onChange={e => { setHomeScore(e.target.value); setEditing(true); }}
            type="number"
            min="0"
          />
          <span className="text-muted-foreground text-xs">-</span>
          <Input
            className="w-12 text-center h-8 text-sm"
            value={awayScore}
            onChange={e => { setAwayScore(e.target.value); setEditing(true); }}
            type="number"
            min="0"
          />
          {editing && (
            <Button size="sm" variant="ghost" onClick={save} className="h-8 px-2">
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1 min-w-[60px] justify-center">
          <span className="font-bold text-sm">{match.played ? match.homeScore : "-"}</span>
          <span className="text-muted-foreground text-xs">-</span>
          <span className="font-bold text-sm">{match.played ? match.awayScore : "-"}</span>
          {isOwner && match.played && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-6 px-1 ml-1">
              ✏️
            </Button>
          )}
        </div>
      )}
      <span className="flex-1 text-sm font-medium truncate">{match.awayTeam}</span>
    </div>
  );
};

export default LeagueDetail;
