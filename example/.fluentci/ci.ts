import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import { fs } from "https://pkg.fluentci.io/trivy_pipeline@v0.1.0/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await fs(client, src);
  });
}

pipeline();
