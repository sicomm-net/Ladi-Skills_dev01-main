import copy,hashlib,importlib.util,json,unittest
from pathlib import Path
sp=Path(__file__).with_name('validate_handoff.py');spec=importlib.util.spec_from_file_location('validator',sp);v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
def fixture():
 m={'protocol':{'id':'AI_META_HANDOFF','version':'0.3'},'handoff':{'id':'H1','task_id':'T1','direction':'SPEC_TO_EXECUTOR'},'human_authority':{'status':'AUTHORITATIVE','source_refs':['spec/task.md'],'precedence':['approved']},'meta_status':{'semantic_match':'CONFIRMED','unresolved':[]},'requirements':[{'id':'R1','target':'queue','acceptance':[{'id':'A1','condition':'serial'}],'source_refs':['spec/task.md']}]}
 rt={'original_human_ref':'spec/task.md','source_revision':'rev1','meta_sha256':hashlib.sha256(v.canonical(m)).hexdigest(),'reconstructed_human':'Only one item is active','reconstruction_input':'META_ONLY','reconstruction_worker':'agent-a','comparison_worker':'agent-b','comparison':[{'requirement_id':'R1','completeness':'MATCH','meaning':'MATCH','constraints_preserved':True,'prohibitions_preserved':True,'acceptance_preserved':True,'unapproved_additions':[],'discrepancies':[]}],'gate':'PASS','reviewer':'agent-b'}
 ms={'task_id':'T1','iteration':1,'protocol_version':'0.3','study_mode':'OBSERVATIONAL','requirement_count':1,'discrepancies':[],'tokens_input':'NOT_AVAILABLE','tokens_output':'NOT_AVAILABLE','elapsed_seconds':'NOT_AVAILABLE','cost_usd':'NOT_AVAILABLE','escaped_defects':'NOT_AVAILABLE','final_gate':'PASS','evidence_refs':[]}
 return {'meta':m,'review':{'round_trip':rt},'measurement':ms}
class Checks(unittest.TestCase):
 def test_pass(self): self.assertEqual(v.check(fixture(),'T1','rev1'),[])
 def test_native_04_pass(self):
  b=fixture();b['meta']['protocol']['version']='0.4';b['measurement']['protocol_version']='0.4'
  b['review']['round_trip']['meta_sha256']=hashlib.sha256(v.canonical(b['meta'])).hexdigest()
  self.assertEqual(v.check(b,'T1','rev1'),[])
 def test_native_04_with_execution_extension(self):
  b=fixture();b['meta']['protocol']['version']='0.4';b['measurement']['protocol_version']='0.4'
  b['meta']['execution_contract']={'risk_tier':'L1','design_freeze':{'references':['UX-MASTER']}}
  b['review']['round_trip']['meta_sha256']=hashlib.sha256(v.canonical(b['meta'])).hexdigest()
  self.assertEqual(v.check(b,'T1','rev1'),[])
 def test_version_mismatch(self):
  b=fixture();b['meta']['protocol']['version']='0.4'
  b['review']['round_trip']['meta_sha256']=hashlib.sha256(v.canonical(b['meta'])).hexdigest()
  self.assertTrue(v.check(b,'T1','rev1'))
 def test_unknown_version(self):
  b=fixture();b['meta']['protocol']['version']='0.5';b['measurement']['protocol_version']='0.5'
  b['review']['round_trip']['meta_sha256']=hashlib.sha256(v.canonical(b['meta'])).hexdigest()
  self.assertTrue(v.check(b,'T1','rev1'))
 def test_blocked(self):
  b=fixture();b['review']['round_trip']['gate']='BLOCKED';self.assertTrue(v.check(b,'T1','rev1'))
 def test_stale(self):self.assertTrue(v.check(fixture(),'T1','rev2'))
 def test_tampered(self):
  b=fixture();b['meta']['requirements'][0]['target']='else';self.assertTrue(v.check(b,'T1','rev1'))
 def test_missing(self):
  b=fixture();del b['review'];self.assertTrue(v.check(b,'T1','rev1'))
 def test_coverage(self):
  b=fixture();b['review']['round_trip']['comparison']=[];self.assertTrue(v.check(b,'T1','rev1'))
 def test_wrong_task_binding(self):
  b=fixture();b['meta']['handoff']['task_id']='T2';self.assertTrue(v.check(b,'T1','rev1'))
 def test_fake_metric(self):
  b=fixture();b['measurement']['cost_usd']=None;self.assertTrue(v.check(b,'T1','rev1'))
if __name__=='__main__':unittest.main()
