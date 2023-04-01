-- Enable Row Level Security
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "Tenant" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "Tenant" USING ("id" = current_setting('app.tenant_id', TRUE)::INT);
CREATE POLICY tenant_isolation_policy ON "Project" USING ("tenantId" = current_setting('app.tenant_id', TRUE)::INT);

-- Create row security policies
CREATE POLICY bypass_rls_policy ON "Tenant" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Project" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');