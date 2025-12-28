import { FeatureList, SearchInput, StatusFilter } from '../components/feature-toggle';
import { useFeatureToggles } from '../hooks/useFeatureToggles';
import { Zap } from 'lucide-react';

const Index = () => {
  const {
    filteredFeatures,
    filters,
    isLoading,
    error,
    counts,
    setSearch,
    setStatus,
    toggleFeature,
    retry,
  } = useFeatureToggles();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border gradient-header">
        <div className="container max-w-4xl py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Feature Toggles</h1>
          </div>
          <p className="text-muted-foreground">
            Manage feature flags for your application
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={filters.search}
            onChange={setSearch}
            className="w-full sm:w-72"
          />
          <StatusFilter
            value={filters.status}
            onChange={setStatus}
            counts={counts}
          />
        </div>

        {/* Feature List */}
        <FeatureList
          features={filteredFeatures}
          onToggle={toggleFeature}
          isLoading={isLoading}
          error={error}
          onRetry={retry}
        />

        {/* Footer Stats */}
        {!isLoading && !error && filteredFeatures.length > 0 && (
          <div className="mt-6 text-center text-sm text-muted-foreground font-mono">
            Showing {filteredFeatures.length} of {counts.all} features
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
