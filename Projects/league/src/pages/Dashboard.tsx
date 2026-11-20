import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Plus, LogOut, Users, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface League {
  id: string;
  name: string;
  created_at: string;
  team_count: number;
  fixture_count: number;
}

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchLeagues();
  }, [user]);

  const fetchLeagues = async () => {
    const { data, error } = await supabase
      .from("leagues")
      .select("id, name, created_at, teams(id), matches(id)")
      .eq("owner_id", user!.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setLeagues(
      (data || []).map((l: any) => ({
        id: l.id,
        name: l.name,
        created_at: l.created_at,
        team_count: l.teams?.length || 0,
        fixture_count: l.matches?.length || 0,
      }))
    );
  };

  const createLeague = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("leagues")
      .insert({ name: newName.trim(), owner_id: user!.id })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setNewName("");
      setDialogOpen(false);
      navigate(`/league/${data.id}`);
    }
    setCreating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-heading font-bold text-foreground">LeagueHub</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4 mr-1" /> Sign out
          </Button>
        </div>
      </nav>

      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Leagues</h1>
            <p className="text-muted-foreground mt-1">Create and manage your sports leagues</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-1" /> New League</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New League</DialogTitle>
              </DialogHeader>
              <form onSubmit={createLeague} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="league-name">League Name</Label>
                  <Input id="league-name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Sunday Football League" required maxLength={100} />
                </div>
                <Button type="submit" className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create League"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {leagues.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No leagues yet</h2>
            <p className="text-muted-foreground mb-6">Create your first league to get started!</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Create League
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leagues.map((league, i) => (
              <Card
                key={league.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all animate-fade-in group"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/league/${league.id}`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{league.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {league.team_count} teams</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {league.fixture_count} matches</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
