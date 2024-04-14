use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn setup() -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "--version"])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn config(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "config", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn fs(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "fs", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn repo(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "repository", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn image(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "image", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn sbom(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "sbom", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn rootfs(args: String) -> FnResult<String> {
    let stdout = dag()
        .pkgx()?
        .with_packages(vec!["trivy"])?
        .with_exec(vec!["trivy", "rootfs", &args])?
        .stdout()?;
    Ok(stdout)
}
